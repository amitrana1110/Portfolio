# Folder structure and editing map

Start with `README.md` for installation, then this map to find the code you need. Paths below are relative to the project root.

```text
portfolio/
├── app/                         Next.js pages and server endpoints
│   ├── layout.jsx               Shared shell, fonts, theme, metadata
│   ├── page.jsx                 Homepage section order
│   ├── globals.css              Themes, responsive layouts, animations
│   ├── contact/page.jsx         Contact page
│   ├── projects/[slug]/page.jsx Project case-study route
│   └── api/contact/route.js     Contact validation and email delivery
├── components/
│   ├── home/                    Homepage sections and interactions
│   │   ├── hero.jsx             Greeting and draggable photo card
│   │   ├── about-cards.jsx      Portrait, technology card, folder, surprise note
│   │   ├── technology-card.jsx Five stacks with matching drop-in icons
│   │   ├── tech-stack.jsx       Skills marquees
│   │   ├── scroll-timeline.jsx  Experience rail fill
│   │   ├── expertise.jsx        Expertise accordion
│   │   ├── highlights.jsx       Achievements carousel
│   │   └── connect-section.jsx  Work-together and booking sections
│   ├── layout/                  Site-wide navigation and footer
│   │   ├── navigation.jsx       Profile pill and navigation dock
│   │   └── footer.jsx           Footer links and seal
│   ├── shared/                  Small reusable presentation components
│   │   ├── avatar.jsx           Portrait and initials fallback
│   │   ├── section-title.jsx    Section labels and headings
│   │   └── resume-link.jsx      Resume download button
│   ├── projects/
│   │   ├── project-grid.jsx     Project covers, cards, grid
│   │   └── case-study.jsx       Back link, progress menu, image lightbox
│   ├── contact/
│   │   ├── contact-form.jsx     Server-delivered contact form UI
│   │   └── contact-wizard.jsx   Homepage email-draft wizard
│   └── motion/
│       ├── motion-root.jsx      Visibility reveals and route transitions
│       └── pointer-motion.jsx   Pointer spring and tilt surface
├── data/portfolio.js            Editable personal and project content
├── lib/
│   ├── motion/card-physics.js   Pure hanging-card simulation
│   └── scroll-scheduler.js      Shared scroll/resize scheduler
├── public/                      Images, fonts, original resume PDF
├── tests/                       Physics and scheduler regression tests
├── scripts/                     Font maintenance script
├── docs/                        Architecture, motion, QA, performance guides
├── output/                      Generated reports, screenshots, project ZIPs
└── tmp/                         Ignored local tools; excluded from project ZIP
```

## How the parts connect

`app/layout.jsx` provides navigation, footer, and motion setup for every route. Each page imports the components it needs directly from the relevant feature folder. Pages and components read `data/portfolio.js`; visual rules remain in `app/globals.css`. Motion components use the reusable functions in `lib/`.

Components with `"use client"` handle clicks, dragging, scrolling, and browser state. Contact email credentials and delivery stay on the server in `app/api/contact/route.js`. Keep credentials in `.env.local`; `.env.example` documents the supported settings.

## Common changes

| Change                                        | File                                                     |
| --------------------------------------------- | -------------------------------------------------------- |
| Name, resume details, projects, portrait path | `data/portfolio.js`                                      |
| Homepage sections and order                   | `app/page.jsx`                                           |
| About text, folder, technology card           | `components/home/about-cards.jsx`                        |
| Photo-card bounce or drag behavior            | `components/home/hero.jsx`, `lib/motion/card-physics.js` |
| Colors, spacing, breakpoints                  | `app/globals.css`                                        |
| Navigation links and top pill                 | `components/layout/navigation.jsx`                       |
| Contact fields                                | `components/contact/contact-form.jsx`                    |
| Project route layout                          | `app/projects/[slug]/page.jsx`                           |

Put new homepage sections in `components/home/`, reusable small UI in `components/shared/`, and content in `data/`. Keep route files focused on assembling the page. Avoid rebuilding a large shared component file.

Run `npm test` and `npm run build` after changing imports or motion logic. Read [the project guide](PROJECT_GUIDE.md) for detailed flows and [the performance notes](PERFORMANCE.md) for saved audit results.
