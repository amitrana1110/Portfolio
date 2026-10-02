import test from 'node:test';
import assert from 'node:assert/strict';
import { gmailDraft } from '../lib/gmail-draft.js';
const data = { recipient: 'owner@example.com', name: ' Amit & Team ', email: 'amit+work@example.com', type: 'Career opportunity', message: ' Hi Amit,\nLet’s talk about C++ & React? #नमस्ते ' };
test('Gmail draft preserves all fields and encodes special characters safely', () => {
  const { web, app } = gmailDraft(data);
  assert.equal(app, web);
  const url = new URL(web);
  assert.equal(url.origin, 'https://mail.google.com');
  assert.equal(url.searchParams.get('to'), data.recipient);
  assert.equal(url.searchParams.get('su'), 'Portfolio enquiry: Career opportunity');
  assert.equal(url.searchParams.get('body'), `Hi Amit,\n\n${data.message.trim()}\n\nName: Amit & Team\nEmail: ${data.email}\nEnquiry type: Career opportunity`);
  assert.equal(url.searchParams.size, 5);
});
test('Android targets Gmail and retains the complete browser fallback', () => {
  const { app, web } = gmailDraft(data, 'Mozilla/5.0 (Linux; Android 15)');
  assert.match(app, /package=com\.google\.android\.gm;/);
  const fallback = app.match(/S\.browser_fallback_url=([^;]+)/)[1];
  assert.equal(decodeURIComponent(fallback), web);
  const nativeQuery = new URLSearchParams(app.split('?')[1].split('#Intent')[0]);
  assert.equal(nativeQuery.get('body'), new URL(web).searchParams.get('body'));
});
test('iOS opens the Gmail compose scheme with the same draft', () => {
  const { app, web } = gmailDraft(data, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)');
  const url = new URL(app);
  assert.equal(url.protocol, 'googlegmail:');
  assert.equal(url.pathname, '/co');
  assert.equal(url.searchParams.get('to'), data.recipient);
  assert.equal(url.searchParams.get('body'), new URL(web).searchParams.get('body'));
});
