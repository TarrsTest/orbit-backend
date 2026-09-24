# orbit-backend

Public HTTP API for the **orbit** demo project (used to exercise Tarrs host
multi-service topology).

- `GET /health` — liveness.
- `GET /` — calls the internal `orbit-agent` service and reports reachability.
- `POST /api/run` — fans a job out to `orbit-agent` `/run`.

Listens on `PORT` (default 8080). Talks to the agent at `AGENT_URL`
(default `http://orbit-agent:9090` — the internal service name).

Part of the **orbit** project: `orbit-backend` (public) + `orbit-agent`
(internal) + `orbit-scheduler` (worker, no port).

## Text API

`GET /api/text?title=...&body=...` turns a title into a slug and reports the
reading time of the body:

```json
{ "slug": "hello-world", "minutes": 1, "words": 3 }
```

A missing or blank `title` returns `400`:

```json
{ "error": "title is required" }
```

Helpers live in `lib/text`:

- `toSlug(title, maxLength = 60)` — URL-safe slug, Unicode-aware.
- `readingTime(text, { wpm = 200 }) -> { minutes, words }` — word count and
  whole minutes, rounding up; throws a `RangeError` when `wpm <= 0`.
