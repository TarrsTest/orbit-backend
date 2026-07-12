const express = require('express');
const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;
const AGENT_URL = process.env.AGENT_URL || 'http://orbit-agent:4000';

app.get('/health', (_req, res) => res.json({ ok: true, service: 'orbit-backend' }));

app.get('/', async (_req, res) => {
  let agent = 'unreachable';
  try {
    const r = await fetch(`${AGENT_URL}/health`, { signal: AbortSignal.timeout(3000) });
    agent = (await r.json()).service;
  } catch (e) { agent = `error: ${e.message}`; }
  res.json({ service: 'orbit-backend', reachedAgent: agent, time: new Date().toISOString() });
});

// Public endpoint that fans out to the internal agent service.
app.post('/api/run', async (req, res) => {
  try {
    const r = await fetch(`${AGENT_URL}/run`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body || {}),
      signal: AbortSignal.timeout(5000),
    });
    res.json(await r.json());
  } catch (e) { res.status(502).json({ error: String(e.message || e) }); }
});

app.listen(PORT, () => console.log(`orbit-backend listening on :${PORT} (agent=${AGENT_URL})`));
