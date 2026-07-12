-- orbit-backend schema. Idempotent — safe to re-run on every boot/deploy.
CREATE TABLE IF NOT EXISTS runs (
  id         BIGSERIAL PRIMARY KEY,
  input      TEXT        NOT NULL,
  result     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS runs_created_at_idx ON runs (created_at DESC);
