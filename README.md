# orbit-backend

Public HTTP API for the **orbit** demo project (used to exercise Tarrs host
multi-service topology). Backed by **Postgres** (persisted runs) and **Redis**
(run counter + short-lived cache).

- `GET /health` — liveness, plus Postgres and Redis connectivity.
- `GET /` — calls the internal `orbit-agent` service, reports reachability and
  the total run count (from Redis).
- `POST /api/run` — fans a job out to `orbit-agent` `/run`, persists the run to
  Postgres, and increments the Redis counter.
- `GET /api/runs` — the 20 most recent persisted runs (Redis-cached for 5s).

## Configuration

Read from the environment (Tarrs injects these per environment):

- `PORT` — listen port (default `8080`).
- `AGENT_URL` — internal agent base URL. Deploy default `http://orbit-agent:9090`
  (Cloud Map). In the dev sandbox siblings talk over localhost, so set
  `AGENT_URL=http://localhost:9090` in `.env`.
- `DATABASE_URL` — Postgres connection string. Injected for the local sidecar
  in dev and the managed DB in staging/live.
- `REDIS_URL` — Redis/Valkey connection string, injected the same way.

## Schema

Migrations live in `migrations/*.sql` (idempotent). The server applies them on
startup before binding the port, so they run identically under `pnpm dev`,
`node server.js`, and the container `CMD`. `pnpm db:migrate` runs them standalone.

Part of the **orbit** project: `orbit-backend` (public) + `orbit-agent`
(internal) + `orbit-scheduler` (worker, no port).
