# Full-site interaction test

## JavaScript conversion follow-up

The project has since been converted to `.js`/`.jsx`, with TypeScript source/configuration and direct TypeScript development dependencies removed. The JavaScript production build, all 10 regression tests, and the six-page HTTP/contact validation suite pass. Follow-up browser checks passed for the fitted portrait dimensions, keyboard card motion, technology flip, contact fields, mobile project navigation, lightbox, and reading-menu anchor, with no observed runtime errors. The original full-site observations below remain a record of the earlier audit.

Tested October 1, 2026 against the production build at `http://localhost:3001`. Desktop interaction tests used 1440 × 1000; mobile interaction tests used 390 × 844. All six pages were additionally checked at widths 320, 375, 768, and 1024px. Mobile testing used a resized Chromium browser, not a physical phone.

## Result

Completed internal interactions passed. No incorrect project-link destinations, missing local fragment targets, broken loaded images, horizontal overflow, or browser runtime errors were observed in the completed checks. No application code changes were needed. The browser occasionally interrupted rapid navigation/scroll sequences; affected checks were repeated after the page settled.

The raw log contains 187 recorded route, control-state, and layout observations: [qa-results.json](../output/qa-results.json). This is an observation log, not a count of independent automated assertions.

| Area | Desktop and mobile checks | Result |
| --- | --- | --- |
| Navigation | About, Work, Expertise, Connect; both Let's connect CTAs; repeated contact visits; case-study Back to home; footer return controls; floating top pill; keyboard skip link | Passed |
| Theme | Switch both ways; desktop reload retains selected theme | Passed |
| About | Technology card flips and returns; education anchor; desktop surprise reveal, download and reset; mobile one-column cards and hidden surprise | Passed |
| Education folder | Desktop hover separates both degrees; mobile centre-screen expansion and closing after scrolling past | Passed |
| Hanging card | Reload motion, arrow-key swing, pointer drag/release, hidden mobile state; physics regression suite | Passed |
| Experience | Orange line fills, reverses to zero and has a transparent gap around the number | Passed |
| Expertise | All five panels expand/collapse; all visible text and desktop image links, on homepage and contact page | Passed |
| Highlights | Next/previous, all three slides, wraparound; repeated carousel on contact page | Passed |
| Projects | All four homepage cards; both contact cards; every related-work card on all four case studies | Passed |
| Case-study controls | Enlarge and close image on all four pages; Escape dismissal; reading menu and every section anchor; menu closes after selection | Passed |
| Contact wizard | All three topics; blank/invalid details rejected; valid details reach message step; previous-step navigation preserves details; encoded email draft destination | Passed |
| Contact form | Name, email, message; all enquiry options; configured-disabled submission state; direct email fallback destination | Passed with delivery limitation below |
| Resume | CV and resume controls clicked; served PDF SHA-256 matches supplied original | Passed |
| Layout/assets | Six routes at all listed widths; local fragment targets; loaded images; horizontal overflow | Passed |

## Limits that still matter

- **Sending a contact-form email is not configured.** The page displays that status and disables Send message. The API returns an honest 503 for a valid submission. To enable delivery, configure `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL`, then test an actual delivery.
- The testing browser **blocked opening the external email application**. Email, phone, and wizard draft destinations were verified directly instead. No message was sent and no call was placed; launching an installed email/dialer app remains dependent on the user's device.
- Expertise image links and the surprise/card controls intentionally hidden in mobile layouts were not forced into view or clicked there.

## Supporting verification

- TypeScript check passed.
- All 10 physics/scroll scheduler regression tests passed.
- HTTP checks passed for homepage, contact and all four projects; unknown project returns 404.
- Contact API checks passed for invalid fields, honeypot, cross-origin rejection, and unconfigured-delivery response.
- Production build had passed before the browser run; no source changes were made during this test.

## Screenshots

Desktop hover expansion: [qa-desktop-education.jpg](../output/qa-desktop-education.jpg).

Mobile centre-screen expansion: [qa-mobile-education.jpg](../output/qa-mobile-education.jpg).
