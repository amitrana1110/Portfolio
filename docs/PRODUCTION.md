# Production setup

Use Node 22 or newer and install reproducibly with `npm ci`. Run `npm test`, `npm run build`, then `npm start`. The hosting service must support Next.js server routes; a static-only export cannot run the contact endpoint.

Set `NEXT_PUBLIC_SITE_URL=https://your-domain.example` in the build environment, using your actual public origin without a path, query, or credentials. Without a public HTTPS origin, pages are marked noindex, robots disallows crawling, and the sitemap is empty. Rebuild after changing this value. Route metadata and contact origin protection share this configuration.

Email delivery is optional. Set all of `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (a verified sender), and `CONTACT_TO_EMAIL` in the server environment to enable it. Keep keys out of public environment variables and source control. Without credentials the form is disabled and direct email remains available. Verify one real delivery after configuring the provider. No actual email has been sent during these changes.

## Contact abuse protection

The endpoint accepts JSON only and reads at most 16,000 bytes, including requests without Content-Length. Fields are checked independently. It rejects cross-origin submissions and honeypots, returns no-store responses, and times out email-provider calls after 15 seconds. The browser times out after 20 seconds. Identical submissions in the same UTC day use a provider idempotency key to reduce duplicate delivery on retries, following [Resend’s idempotency documentation](https://resend.com/docs/dashboard/emails/idempotency-keys).

A process-local limiter permits five attempts per ten minutes. By default all visitors share this conservative limit because untrusted forwarded IPs must not bypass it. Enable `CONTACT_TRUST_PROXY=true` only when the hosting proxy overwrites X-Forwarded-For with the real client address and direct server access is blocked. Verify that behavior with your hosting provider. The limiter has bounded storage and clears expired entries.

For serverless or multiple replicas, configure a hosting firewall/shared rate limit for POST /api/contact (five attempts per client IP per ten minutes). Local counters reset on restart and do not coordinate across replicas. They are a backstop, not a distributed limiter. Keep the shared default if proxy behavior is unknown.

## Launch verification

- Verify the public domain uses HTTPS and the configured canonical URLs, robots.txt, and sitemap.xml reference it.
- Check homepage, contact, all four case studies, a missing project, and the resume download.
- Check mobile/desktop navigation, dark mode, keyboard access, reduced motion, image lightbox, and contact flows on the deployed URL.
- Confirm email delivery if enabled and observe 429 responses with Retry-After when testing the rate limit.
- Run `npm audit --omit=dev` periodically and review dependency upgrades before release.

## Validation on October 2, 2026

The automated suite includes physics, shared scroll cleanup, malformed/oversized JSON, field validation, rate-limit expiry, and URL configuration checks. Saved Lighthouse/browser reports in output predate these changes; they are not fresh deployment audits.

Final verification: all 15 tests passed; the production build passed; all six page routes and public SEO/resume resources returned 200; a missing project returned 404. Integration checks passed for 403 cross-origin protection, 400 invalid fields/honeypots, 415 unsupported content, 413 oversized uploads, 503 unconfigured delivery, and 429 throttling with Retry-After. Security headers and preview noindex behavior were checked on the production server. `npm audit` reported zero known vulnerabilities across installed dependencies. Real delivery and fresh browser/deployed performance checks remain unverified.
