# orbit-backend

Public HTTP API for the **orbit** demo project (used to exercise Tarrs host
multi-service topology).

- `GET /health` — liveness.
- `GET /` — calls the internal `orbit-agent` service and reports reachability.
- `POST /api/run` — fans a job out to `orbit-agent` `/run`.

Listens on `PORT` (default 3000). Talks to the agent at `AGENT_URL`
(default `http://orbit-agent:4000` — the internal service name).

Part of the **orbit** project: `orbit-backend` (public) + `orbit-agent`
(internal) + `orbit-scheduler` (worker, no port).
