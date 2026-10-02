# Amit Singh Rana — Portfolio

Next.js App Router, JavaScript, JSX, and Tailwind CSS. The visual layout and motion follow the supplied Zolt reference; content comes from `Amit_Resume.pdf`.

For the complete architecture, visitor flows, animation details, editing instructions, configuration, and troubleshooting, read [PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md).

For a beginner-friendly file tree and editing map, read [Folder structure](docs/FOLDER_STRUCTURE.md). Pages live in `app/`, personal content in `data/`, components are grouped by feature, reusable motion logic lives in `lib/`, and documentation lives in `docs/`.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` then `npm start`.

## Content and assets

Edit `data/portfolio.js` to update all personal details, skills, education, achievements, expertise, and project case studies. The original PDF is available at `/Amit_Resume.pdf` and every CV link downloads that file.

The homepage includes the three named resume projects and the Haldiram D2C contribution described under employment. All numerical achievements are from the resume. Project dates and URLs not supplied in the resume are omitted. Work highlights adapt the reference's testimonial carousel without inventing quotes. The two-card hiring layout uses verified experience and achievements in place of template pricing.

The supplied professional portrait is stored at `public/images/amit-portrait.png` and configured through `portfolio.portrait`. The shared avatar component uses it in identity cards, contact areas, and small profile avatars, with initials as a fallback. The project covers are original SVG concept illustrations, explicitly labeled rather than represented as production screenshots. Add actual screenshots by changing project `image` paths. Add verified GitHub, LinkedIn, and project links only when available.

Satoshi fonts are served locally with Next.js font optimization; the decorative waving-hand asset follows the reference. No Framer branding or promotional links are included.

## Contact delivery

Copy `.env.example` to `.env.local` and set:

- `RESEND_API_KEY`: server-side email API key.
- `CONTACT_FROM_EMAIL`: sender verified with Resend.
- `CONTACT_TO_EMAIL`: your inbox (rana.amit.1110@gmail.com).
- `NEXT_PUBLIC_SITE_URL`: your deployed origin for SEO metadata.

The contact form has native field validation plus server-side validation and honest loading/error/success states. Without credentials, it explains the setup requirement and offers a working direct email link. The homepage's three-step flow prepares a mailto draft; it clearly states that sending happens in the visitor's email app. It never shows a false sent state.

The endpoint includes origin protection, bounded JSON streaming (16 KB), field validation, a honeypot, provider timeout, and a bounded process-local limit of five attempts per ten minutes. See [Production setup](docs/PRODUCTION.md) for proxy trust, multi-instance limits, and deployment configuration.

## Motion and interactions

- Multilingual blur/fade greeting, waving hand, and blur-to-focus section entrances.
- Draggable/throwable profile card with 3D twist, cord tension, retained throw velocity, damped oscillation, and arrow-key controls.
- Five-stack technology card with matching gravity-style drop-in icons, animated education folder, and an evasive cursor-driven note with changing messages and tap/Enter resume reveal.
- Two opposing technology marquees, expertise accordions with the first item expanded, and a work-highlight carousel.
- Spring-driven 3D portrait/identity card tilt, restrained project zoom, and an interactive footer wax seal.
- Desktop side dock and mobile bottom dock, active section states, saved light/dark themes.
- Project image lightbox, reading-progress control, and case-study jump links.
- Three-step contact flow with validation and editable email draft.

All movement respects `prefers-reduced-motion`; controls are keyboard accessible.

## Validation

```sh
npm run build
```

Browser checks cover 320, 375, 390, 768, 1024, and 1440px. HTTP checks cover all four project routes, missing-project 404, resume file integrity, form validation, origin protection, honeypot handling, and missing-credential response. No email was sent during testing.

The supplied 106-second local recording (`10-59-22.mp4`) was reviewed across its full duration using 213 timestamped frames. See `docs/MOTION_REFERENCE.md` for the observed interactions and implementation notes.

Physics regression checks (Node 22+):

```sh
npm test
```

The hanging card also drops and bounces after every reload, can be dragged outside the hero in all directions, and keeps its clicked grab offset. The experience rail fills continuously with scrolling and has masked gaps around its numbers. These behaviors were checked against the follow-up local recording `11-39-05.mp4`.

## Performance and Lighthouse

Audit the production build, rather than `npm run dev`. Run `npm run build`, then `npm start` after stopping the development server.

```sh
npx --yes lighthouse@12.8.2 http://localhost:3000 --output=html --output-path=output/lighthouse.html --chrome-flags="--headless"
npm test
```

Chrome must be installed for the Lighthouse CLI. Measured results and saved reports are listed in `docs/PERFORMANCE.md`. Hosting and device conditions affect scores.

The initial viewport paints immediately; entrance transitions remain for later sections and route changes. Scroll controls share a frame scheduler, hidden mobile badge physics is skipped, and off-screen decorative animations and greeting updates pause. The original Satoshi weights are retained in smaller font subsets. To regenerate font assets after introducing new characters, install Python `fonttools` and `brotli`, then run `python scripts/subset-fonts.py` and rebuild.

Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin before building so canonical URLs, robots.txt, and sitemap.xml identify the live site. Unconfigured and localhost previews are marked noindex and have an empty sitemap. Image assets use a one-day browser cache with stale-while-revalidate.
# Portfolio
