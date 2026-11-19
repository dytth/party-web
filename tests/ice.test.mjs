import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequestPost } from '../functions/api/ice-servers.js';
import { loadIceConfiguration } from '../src/utils/ice.ts';

const relay = {
  urls: ['turn:relay.example:3478?transport=udp', 'turn:relay.example:53', 'turns:relay.example:443?transport=tcp'],
  username: 'temporary-user',
  credential: 'temporary-password',
};
const env = { TURN_KEY_ID: 'test-id', TURN_KEY_API_TOKEN: 'server-only-test-token' };

test('client receives short-lived TURN credentials through the Pages function', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(options.method, 'POST');
    if (url === '/api/ice-servers') return onRequestPost({ env });
    assert.equal(url, 'https://rtc.live.cloudflare.com/v1/turn/keys/test-id/credentials/generate-ice-servers');
    assert.equal(options.headers.Authorization, `Bearer ${env.TURN_KEY_API_TOKEN}`);
    assert.deepEqual(JSON.parse(options.body), { ttl: 86400 });
    return Response.json({ iceServers: [relay, { urls: 'turn:invalid.example' }] }, { status: 201 });
  });

  const config = await loadIceConfiguration(new AbortController().signal);
  assert.equal(config.iceServers.length, 3);
  assert.deepEqual(config.iceServers[2], { ...relay, urls: [relay.urls[0], relay.urls[2]] });
  assert.equal(JSON.stringify(config).includes(env.TURN_KEY_API_TOKEN), false);
});

test('unconfigured relay falls back to STUN without requesting Cloudflare credentials', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url, '/api/ice-servers');
    const response = await onRequestPost({ env: {} });
    assert.equal(response.status, 503);
    return response;
  });

  const config = await loadIceConfiguration(new AbortController().signal);
  assert.equal(config.iceServers.length, 2);
  assert.ok(config.iceServers.every(({ urls }) => urls.startsWith('stun:')));
});

test('upstream failure returns no provider details and is not cached', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('provider error details', { status: 403 }));
  const response = await onRequestPost({ env });
  assert.equal(response.status, 502);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(await response.text(), '');
});

test('canceling a connection attempt aborts the credential request', async (t) => {
  let requestSignal;
  t.mock.method(globalThis, 'fetch', (_url, { signal }) => new Promise((_resolve, reject) => {
    requestSignal = signal;
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  }));

  const attempt = new AbortController();
  const configuration = loadIceConfiguration(attempt.signal);
  attempt.abort();
  await configuration;
  assert.equal(requestSignal.aborted, true);
});
