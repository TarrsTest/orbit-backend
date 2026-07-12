// Postgres + Redis wiring for orbit-backend.
//
// Connection strings come from the environment. On Tarrs the platform injects
// DATABASE_URL / REDIS_URL for the local sidecars (dev) and the managed
// instances (staging/live); the localhost fallbacks below only matter when you
// run `node server.js` by hand outside the sandbox.
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const Redis = require('ioredis');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/postgres';
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// The dev sandbox's local Postgres authenticates via its unix socket (trust);
// its localhost TCP listener wants a password we don't hold. So for a
// passwordless localhost URL (the injected dev default) connect over the
// socket. Remote URLs (staging/live, which carry a password) go through as-is.
function pgConfig(url) {
  const u = new URL(url);
  const isLocal = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  if (isLocal && !u.password) {
    return {
      host: '/var/run/postgresql',
      port: Number(u.port) || 5432,
      user: decodeURIComponent(u.username) || 'postgres',
      database: decodeURIComponent(u.pathname.slice(1)) || 'postgres',
      max: 5,
    };
  }
  return { connectionString: url, max: 5 };
}

const pool = new Pool(pgConfig(DATABASE_URL));

// lazyConnect keeps startup from crashing if Redis is briefly unavailable;
// ioredis retries in the background and commands queue until it's up.
const redis = new Redis(REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 2 });
redis.on('error', (e) => console.error(`[orbit-backend] redis error: ${e.message}`));

// Apply every migrations/*.sql in order. Files are idempotent
// (CREATE ... IF NOT EXISTS), so this is safe on every boot.
async function migrate() {
  const dir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), 'utf8');
    await pool.query(sql);
    console.log(`[orbit-backend] migration applied: ${f}`);
  }
}

module.exports = { pool, redis, migrate };
