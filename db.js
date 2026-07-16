// Postgres + Redis wiring for orbit-backend.
//
// Connection strings come from the environment. On Tarrs the platform injects
// DATABASE_URL / REDIS_URL for the local sidecars (dev) and the managed
// instances (staging/live); the localhost fallbacks below only matter when you
// run `node server.js` by hand outside the sandbox.
const path = require('path');
const { execFile } = require('child_process');
const { Pool } = require('pg');
const Redis = require('ioredis');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/postgres';
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// The dev sandbox's local Postgres authenticates via its unix socket (trust);
// its localhost TCP listener wants a password we don't hold. So for a
// passwordless localhost URL (the injected dev default) connect over the
// socket. Remote URLs (staging/live, which carry a password) go through as-is,
// but over TLS — the managed Postgres enforces encryption.
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
  return { connectionString: url, max: 5, ssl: { rejectUnauthorized: false } };
}

const pool = new Pool(pgConfig(DATABASE_URL));

// lazyConnect keeps startup from crashing if Redis is briefly unavailable;
// ioredis retries in the background and commands queue until it's up.
const redis = new Redis(REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 2 });
redis.on('error', (e) => console.error(`[orbit-backend] redis error: ${e.message}`));

// Run pending Sequelize migrations (migrations/*.js) before the app serves.
// sequelize-cli tracks applied migrations in the SequelizeMeta table, so this
// only runs what's new and is safe on every boot/deploy. We invoke the CLI
// through node explicitly (no reliance on the shebang / exec bit) and share the
// process env so it picks up the injected DATABASE_URL.
function migrate() {
  const cli = path.join(__dirname, 'node_modules', 'sequelize-cli', 'lib', 'sequelize');
  return new Promise((resolve, reject) => {
    execFile(process.execPath, [cli, 'db:migrate'], { cwd: __dirname, env: process.env }, (err, stdout, stderr) => {
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = { pool, redis, migrate };
