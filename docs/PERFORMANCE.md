# Performance verification

Measured October 1, 2026 using Lighthouse 12.8.2 against the local production build (`next build` / `next start`, port 3001). Mobile uses Lighthouse's default simulated mobile throttling; desktop uses `--preset=desktop`. These are individual lab runs, not field Core Web Vitals. Device load, hosting, and network conditions can change scores.

| Page / device | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Homepage mobile, before | 93 | 96 | 100 | 100 |
| Homepage mobile, optimized | 99 | 100 | 100 | 100 |
| Homepage desktop, optimized | 100 | 100 | 100 | 100 |
| Contact mobile, optimized | 99 | 100 | 100 | 100 |
| Haldiram case study mobile, optimized | 97 | 100 | 100 | 100 |

Homepage mobile LCP improved from 2.9s to 2.1s, Speed Index from 4.1s to 1.2s, and FCP from 1.1s to 0.9s. Both runs had zero measured layout shift. Desktop and case-study reports were captured before the final contact-only heading correction; the contact report includes that correction.

## Changes

- Initial viewport content stays visible during hydration; subsequent sections and route navigation retain their entrance animations.
- Scroll-driven profile, dock, and case-study progress controls share one passive listener and one animation frame. Active section updates occur once per frame.
- Hidden mobile card physics is skipped. Off-screen decorative animation and greeting intervals pause. Desktop card physics and drag behaviour remain intact.
- Three Satoshi font weights were subset from 76,440 to 46,696 bytes (about 39% smaller), retaining authored characters, Latin, punctuation, and arrows. Original fonts remain available. Regenerate with `scripts/subset-fonts.py` after adding new characters.
- Canonical metadata, robots.txt, sitemap.xml, image cache headers, and removal of the powered-by header improve delivery and indexing.
- Corrected invalid ARIA labels, profile contrast and accessible naming, and contact heading order.

## Saved reports

- [Homepage mobile](../output/lighthouse-home-mobile.report.html)
- [Homepage desktop](../output/lighthouse-home-desktop.report.html)
- [Contact mobile](../output/lighthouse-contact-mobile.report.html)
- [Case study mobile](../output/lighthouse-project-mobile.report.html)
- [Baseline mobile JSON](../output/lighthouse-before-mobile.json)

Matching JSON files accompany the HTML reports for reproducible inspection. Lighthouse flags some framework JavaScript as unused or legacy on initial navigation; retaining supported browser behaviour is preferable to removing framework polyfills solely to change an audit.

## Validation

Production build and TypeScript compilation passed. All 10 physics and scroll scheduler regression tests passed. HTTP checks verified all six page routes, canonical URLs, robots.txt, sitemap.xml, and asset cache headers. Browser checks verified desktop dragging, repeated contact navigation, mobile card stacking, no horizontal overflow at 390px, the default expanded expertise panel, and off-screen animation pausing.

Set `NEXT_PUBLIC_SITE_URL` to the public deployment origin before building. The local fallback is intended for development. Audit the deployed production URL again after hosting is configured; development-server scores are not representative.

## Mobile optimization follow-up

The user reported a mobile score of 73. The current code measured 87 in a local production audit before this follow-up. Lighthouse 12.8.2, default simulated mobile throttling, homepage at `http://localhost:3002/`, performance category only. These local conditions are not identical to the user's device or hosting.

- Preload the About portrait, which is the mobile largest content element, rather than discovering it through lazy loading.
- Read all initial reveal bounds before writing visibility attributes, preventing interleaved DOM reads and writes from repeatedly triggering layout.
- Use opacity and transform transitions on mobile instead of animated blur filters. Desktop blur transitions remain.
- Render static section headings, project grids, resume links, and footer on the server when imported by route components. Interactive components remain client components.

| Measurement | Baseline | Final run | Final repeat |
| --- | ---: | ---: | ---: |
| Mobile performance | 87 | 92 | 94 |
| Largest contentful paint | 3.3 s | 3.0 s | 2.9 s |
| Total blocking time | 280 ms | 160 ms | 120 ms |
| Cumulative layout shift | 0 | 0 | 0 |

Reports: [baseline JSON](../output/mobile-current.json), [final HTML](../output/mobile-final.report.html), [repeat HTML](../output/mobile-final-repeat.report.html). An intermediate run scored 94 with 80 ms blocking time; the final repeated runs above are the relevant result after the server-component changes.

Production build, all 10 existing regression tests, six route HTTP checks, resume integrity, and contact validation checks passed. At 390px the portrait loaded, About cards remained in one column, the technology card advanced to Tailwind, and there was no horizontal overflow. Scores vary between runs; audit `npm run build` / `npm start` rather than the development server. Recheck the deployed production URL after updating hosting.

Final desktop production performance: 100. Report: [desktop JSON](../output/desktop-final-performance.json).
