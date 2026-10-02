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

## Mobile layout update — October 2, 2026

Mobile styles are now grouped in `app/mobile.css`, loaded after shared styles. The phone layout has fluid hero sizing, larger body text and form fields, labeled bottom navigation, compact contact identity, and content-sized resume/wizard cards. Safe-area viewport support and extra footer clearance accommodate the bottom dock; it hides while text fields are focused.

Chromium emulation checks passed for all six routes at 320, 375, 390, 430, 600, 768, and 1440px (42 route/width combinations), with no horizontal overflow or observed JavaScript errors. Interactions checked: navigation anchors, dark/light themes, technology switching, three-step email draft, field focus and dock visibility, and project lightbox. No email was sent. These checks use browser emulation rather than physical devices.

Results: `output/mobile-layout-check.json`. Screenshots: `output/mobile-home-updated.png`, `output/mobile-contact-updated.png`, `output/mobile-work-dark-updated.png`, and `output/mobile-wizard-updated.png`.

The production build also passed. With normal animations enabled, production CSS ordering and section reveals passed at 320, 390, 768, and 1440px. Desktop navigation labels remain hidden and the desktop layout remains governed by shared styles. Production viewport screenshots are saved as `output/mobile-production-{width}.png`.

## Shorter mobile homepage and education fix — October 2, 2026

The education folder now reserves a fixed illustration area and keeps both papers, including their rotated corners, inside the card through the full mobile scroll animation. The papers are centered and separated enough to read both degree names and dates.

Below 810px, the homepage uses compact rows for all four projects; shows the two primary skill groups and first three experience achievements; and uses smaller education cards and a direct contact-page CTA. The repeated technology card, highlights carousel, expanded hiring details, and homepage contact wizard are hidden on mobile. Full details remain in the resume and project pages. Navigation ignores hidden sections when selecting the active dock item. Desktop styling is unchanged.

At 390px, homepage height decreased from 11,584px to 5,695px (51%). At 320px it decreased from 12,131px to 6,065px (50%). The folder bounds, no horizontal overflow, education anchor, and Work/Connect dock states passed at 320, 375, 390, 430, 600, and 768px. Desktop section geometry matched at 1024 and 1440px; the 1440px viewport screenshot was byte-for-byte identical before and after.

The production build passed. Measurements are in `output/mobile-compact-check.json`; previews are `output/mobile-education-contained-dark.png` and `output/mobile-compact-projects.png`. Checks use Chromium emulation, not physical devices.

With animations enabled in the production build, folder papers remained contained at three scroll positions at 320, 390, and 768px. Project navigation and the direct contact CTA/form also passed at those widths. No email was sent.
