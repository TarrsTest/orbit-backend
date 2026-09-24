const test = require('node:test');
const assert = require('node:assert/strict');

const app = require('../server');

test('GET /api/text end-to-end through the mounted router', async () => {
  const server = app.listen(0);
  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();
    const base = `http://127.0.0.1:${port}/api/text`;

    const ok = await fetch(`${base}?title=Hello%20World&body=one%20two%20three`);
    assert.strictEqual(ok.status, 200);
    assert.deepStrictEqual(await ok.json(), { slug: 'hello-world', minutes: 1 });

    const bad = await fetch(base);
    assert.strictEqual(bad.status, 400);
    assert.deepStrictEqual(await bad.json(), { error: 'title is required' });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
