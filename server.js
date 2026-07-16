require('dotenv').config(); // load repo .env (dev config); platform-injected process.env still wins
const express = require('express');
const { pool, redis, migrate } = require('./db');
const app = express();
app.use(express.json());

// CORS — the orbit-frontend (Vercel/browser) calls this API cross-origin.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const PORT = Number(process.env.PORT) || 8080;
const AGENT_URL = process.env.AGENT_URL || 'http://orbit-agent:9090';
const RUNS_COUNT_KEY = 'orbit:runs:count';
const RUNS_RECENT_KEY = 'orbit:runs:recent';

app.get('/health', async (_req, res) => {
  const health = { ok: true, service: 'orbit-backend', db: 'ok', redis: 'ok' };
  try { await pool.query('SELECT 1'); } catch (e) { health.ok = false; health.db = `error: ${e.message}`; }
  try { await redis.ping(); } catch (e) { health.ok = false; health.redis = `error: ${e.message}`; }
  res.status(health.ok ? 200 : 503).json(health);
});

app.get('/', async (_req, res) => {
  let agent = 'unreachable';
  try {
    const r = await fetch(`${AGENT_URL}/health`, { signal: AbortSignal.timeout(3000) });
    agent = (await r.json()).service;
  } catch (e) { agent = `error: ${e.message}`; }
  const totalRuns = Number(await redis.get(RUNS_COUNT_KEY).catch(() => 0)) || 0;
  res.json({ service: 'orbit-backend', reachedAgent: agent, totalRuns, time: new Date().toISOString() });
});

// Public endpoint: fan the job out to the internal agent, persist it to
// Postgres, and bump the Redis run counter.
app.post('/api/run', async (req, res) => {
  const input = req.body && req.body.input != null ? String(req.body.input) : 'nothing';
  try {
    const r = await fetch(`${AGENT_URL}/run`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input }),
      signal: AbortSignal.timeout(5000),
    });
    const agentResult = await r.json();

    const { rows } = await pool.query(
      'INSERT INTO runs (input, result) VALUES ($1, $2) RETURNING id, created_at',
      [input, agentResult.result ?? null],
    );
    const totalRuns = await redis.incr(RUNS_COUNT_KEY);
    await redis.del(RUNS_RECENT_KEY); // invalidate the recent-runs cache

    res.json({ id: rows[0].id, createdAt: rows[0].created_at, totalRuns, agent: agentResult });
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
});

// Recent persisted runs, cached in Redis for 5s to spare Postgres.
app.get('/api/runs', async (_req, res) => {
  try {
    const cached = await redis.get(RUNS_RECENT_KEY).catch(() => null);
    if (cached) return res.json({ cached: true, runs: JSON.parse(cached) });

    const { rows } = await pool.query(
      'SELECT id, input, result, created_at FROM runs ORDER BY created_at DESC LIMIT 20',
    );
    await redis.set(RUNS_RECENT_KEY, JSON.stringify(rows), 'EX', 5).catch(() => {});
    res.json({ cached: false, runs: rows });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// Migrate before binding the port so the schema exists on every boot — works
// identically under `pnpm dev`, `node server.js`, and the container CMD.
migrate()
  .then(() => app.listen(PORT, () => console.log(`orbit-backend listening on :${PORT} (agent=${AGENT_URL})`)))
  .catch((e) => { console.error(`[orbit-backend] migration failed: ${e.message}`); process.exit(1); });
