// Sequelize CLI config. Mirrors db.js's connection logic so migrations connect
// the same way the app does — including the dev sandbox's unix-socket quirk:
// the injected dev DATABASE_URL is passwordless localhost, but the local PG's
// TCP listener wants a password, so passwordless-localhost connects over the
// /var/run/postgresql socket. Remote (staging/live) URLs carry a password and
// go through as a plain connection string.
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/postgres';

function build(url) {
  const u = new URL(url);
  const isLocal = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  if (isLocal && !u.password) {
    return {
      dialect: 'postgres',
      host: '/var/run/postgresql',
      port: Number(u.port) || 5432,
      username: decodeURIComponent(u.username) || 'postgres',
      database: decodeURIComponent(u.pathname.slice(1)) || 'postgres',
    };
  }
  // Remote managed Postgres (staging/live) enforces TLS — connect with SSL.
  return { dialect: 'postgres', url, dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } };
}

const cfg = build(DATABASE_URL);

// sequelize-cli selects by NODE_ENV (default "development"). Every env resolves
// its connection from DATABASE_URL, so they all share the same built config.
module.exports = { development: cfg, staging: cfg, production: cfg, test: cfg };
