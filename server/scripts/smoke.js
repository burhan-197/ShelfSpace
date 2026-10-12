// Smoke test: boots the app with SKIP_DB=1 on an ephemeral port and asserts
// the key routes respond. Run with: npm test
const { spawn } = require('child_process');
const path = require('path');

const PORT = 18080;
const BASE = `http://127.0.0.1:${PORT}`;

const checks = [
  { name: 'GET / (library page)', path: '/', expect: 200 },
  { name: 'GET /api/v1/health', path: '/api/v1/health', expect: 200 },
  { name: 'GET /api/docs (Swagger UI)', path: '/api/docs/', expect: 200 },
  { name: 'GET /api/docs/openapi.json', path: '/api/docs/openapi.json', expect: 200 },
  { name: 'GET /api/v1/books (no DB → 503)', path: '/api/v1/books', expect: 503 },
  { name: 'GET /api/v1/books/meta (no DB → 503)', path: '/api/v1/books/meta', expect: 503 }
];

async function waitForServer(child, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/api/v1/health`);
      if (res.ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Server did not become ready in time');
}

async function main() {
  const child = spawn('node', ['app.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(PORT), SKIP_DB: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let output = '';
  child.stdout.on('data', (d) => { output += d; });
  child.stderr.on('data', (d) => { output += d; });

  let failures = 0;
  try {
    await waitForServer(child);

    for (const check of checks) {
      const res = await fetch(BASE + check.path);
      const ok = res.status === check.expect;
      console.log(`${ok ? 'PASS' : 'FAIL'}  ${check.name} → ${res.status} (expected ${check.expect})`);
      if (!ok) failures++;
    }

    // Envelope shape check on the DB-guarded error path.
    const errRes = await fetch(`${BASE}/api/v1/books`);
    const body = await errRes.json();
    const envelopeOk =
      body.success === false && body.error && body.error.code === 'SERVICE_UNAVAILABLE';
    console.log(`${envelopeOk ? 'PASS' : 'FAIL'}  503 envelope {success:false, error:{code}} shape`);
    if (!envelopeOk) failures++;

    // Health payload shape check.
    const health = await (await fetch(`${BASE}/api/v1/health`)).json();
    const healthOk = health.status === 'ok' && typeof health.uptime === 'number' && typeof health.version === 'string';
    console.log(`${healthOk ? 'PASS' : 'FAIL'}  health payload {status, uptime, version}`);
    if (!healthOk) failures++;
  } catch (err) {
    console.error('Smoke test error:', err.message);
    console.error('--- server output ---');
    console.error(output);
    failures++;
  } finally {
    child.kill('SIGTERM');
  }

  if (failures > 0) {
    console.error(`\n${failures} check(s) failed.`);
    process.exit(1);
  }
  console.log('\nAll smoke checks passed.');
  process.exit(0);
}

main();
