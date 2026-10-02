import { createHash } from 'node:crypto';
import { readContactBody, validateContact, contactRateLimit } from '@/lib/contact';
import { siteOrigin } from '@/lib/site-url';
export const runtime = 'nodejs';
const reply = (body, status = 200, headers = {}) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store', ...headers },
});
export async function POST(request) {
  const origin = request.headers.get('origin');
  const expected = siteOrigin() || new URL(request.url).origin;
  if ((origin && origin !== expected) || request.headers.get('sec-fetch-site') === 'cross-site') {
    return reply({ error: 'Invalid request origin.' }, 403);
  }
  // Only trust forwarded IPs when the deployment proxy overwrites this header.
  const ip = process.env.CONTACT_TRUST_PROXY === 'true'
    ? request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    : 'shared';
  const retry = contactRateLimit(`ip:${ip}`);
  if (retry) return reply({ error: 'Too many requests. Please try again later or email directly.' }, 429, { 'Retry-After': String(retry) });
  let data;
  try { data = validateContact(await readContactBody(request)); }
  catch (error) { return reply({ error: error.status ? error.message : 'Invalid request.' }, error.status || 400); }
  if (!data) return reply({ error: 'Please enter a valid name, email, enquiry type, and message (10–5,000 characters).' }, 400);
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return reply({ error: 'Email delivery is not configured. Please use the direct email link.' }, 503);
  }
  const { name, email, type, message } = data;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json',
        'Idempotency-Key': createHash('sha256').update(JSON.stringify(data) + Math.floor(Date.now() / 86400000)).digest('hex'),
      },
      body: JSON.stringify({ from: CONTACT_FROM_EMAIL, to: [CONTACT_TO_EMAIL], reply_to: email,
        subject: `Portfolio enquiry: ${type}`, text: `From: ${name}\nEmail: ${email}\nType: ${type}\n\n${message}` }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error('Provider rejected request');
    return reply({ success: true });
  } catch {
    return reply({ error: 'Your message could not be delivered. Please try again or use the email link.' }, 502);
  }
}
