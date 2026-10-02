import test from 'node:test';
import assert from 'node:assert/strict';
import { readContactBody, validateContact, contactRateLimit } from '../lib/contact.js';
import { siteOrigin, isPublicOrigin } from '../lib/site-url.js';
const valid = { name: ' Amit ', email: 'hello@example.com', type: 'Project enquiry', message: 'A sufficiently long message.' };
test('contact accepts normalized valid fields and rejects invalid input', () => {
  assert.equal(validateContact(valid).name, 'Amit');
  for (const data of [null, [], { ...valid, email: 'a@@b.com' }, { ...valid, name: 'a\nb' }, { ...valid, message: 'short' }, { ...valid, type: 'Spam' }, { ...valid, website: 'bot' }]) assert.equal(validateContact(data), null);
});
test('body limit is enforced for chunked bodies without Content-Length', async () => {
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(8000)); controller.enqueue(new Uint8Array(8001)); controller.close(); } });
  const request = new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: stream, duplex: 'half' });
  await assert.rejects(readContactBody(request), e => e.status === 413);
});
test('contact body rejects unsupported content and malformed JSON', async () => {
  for (const [type, body, status] of [['text/plain', '{}', 415], ['application/json', '{', 400]]) {
    await assert.rejects(readContactBody(new Request('http://localhost', { method: 'POST', headers: { 'Content-Type': type }, body })), e => e.status === status);
  }
  assert.deepEqual(await readContactBody(new Request('http://localhost', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valid) })), valid);
});
test('rate limit blocks sixth attempt, isolates clients and expires', () => {
  for (let i = 0; i < 5; i++) assert.equal(contactRateLimit('test-client', 1000), 0);
  assert.equal(contactRateLimit('test-client', 1000), 600);
  assert.equal(contactRateLimit('other-client', 1000), 0);
  assert.equal(contactRateLimit('test-client', 601000), 0);
});
test('only configured public HTTPS deployments are indexed', () => {
  assert.equal(siteOrigin(''), null);
  assert.equal(isPublicOrigin(siteOrigin('http://localhost:3000')), false);
  assert.equal(isPublicOrigin(siteOrigin('https://portfolio.example')), true);
  for (const value of ['file:///tmp', 'https://example.com/path', 'https://user:pass@example.com']) assert.throws(() => siteOrigin(value));
});
