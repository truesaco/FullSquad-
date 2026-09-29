# FullSquad: Landing Page

Responsive marketing site for **FullSquad**, the free app that fills pickup soccer games by position and skill, runs a fair waitlist, and backfills dropouts with one tap.

Built from the Landing PRD, the Brand Identity & Design System, and the Research Summary. The competitive scan and the page changes that came out of it are in [`docs/market-research.md`](docs/market-research.md).

- **Stack:** Next.js (static export), React, TypeScript, Tailwind CSS v4
- **Responsive:** mobile-first from 360px phones through tablets to 1440px+ desktops, with a slide-out menu and a sticky "Post a Game" button on phones
- **Light and dark mode:** follows the system setting, with a toggle that remembers the choice
- **Accessible:** skip link, visible focus rings, keyboard-navigable walkthrough tabs, `aria-live` updates for the calculator and roster, reduced-motion support, and status never shown by color alone
- **Lead capture:** waitlist form backed by **Netlify Forms**, so there's no server to run

## App demo (`/app/`)

The site also includes a working demo of the FullSquad app, which runs entirely in the browser with simulated players. It's responsive: on a phone it shows a bottom tab bar like a native app, and on a tablet or desktop it's a web app with a sidebar. Installing the site to a home screen (PWA) opens straight into the app.

| Screen | What you can do |
|---|---|
| **Feed** | Toggle the positions you play (GK, DEF, MID, FWD). Games that need you rise to the top. Tap In, or join the waitlist. |
| **My Games** | See the games you organize and the ones you're playing in. |
| **Post** | Choose the format, then toggle the positions you need (with a count for each) or leave it on **Any position**. Optionally send it to your crew right away. |
| **Game** | Live roster and position balance, the waitlist, and a log of everything FullSquad did. Simulate a dropout to watch the backfill offer roll down the waitlist (15 seconds stands in for 15 minutes). |
| **Crew** | Your regulars with their positions and attendance, a position filter, and nearby players you can add. |
| **Profile** | Your positions and skill, notification settings, theme, and a reset for the demo data. |

The "Post a game" builder on the landing page hands its game to the demo ("See this game run in the app demo"). Demo data is saved in `localStorage`, and the demo logic lives in `lib/demo/model.ts`.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to /out
npm start          # serves /out to preview the production build
```

The waitlist form only saves submissions once the site is deployed on Netlify. Locally it shows its error state, which is expected.

## Deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and pick the repo. Build settings come from `netlify.toml` (`npm run build` → `out`).
3. **Turn on forms:** go to **Site configuration → Forms** and click **Enable form detection**, then redeploy. Submissions appear under **Forms → waitlist**. You can add email notifications or a Zapier/CRM hook there.
4. *(Optional)* Under **Site configuration → Environment variables**:
   - `NEXT_PUBLIC_SITE_URL`: your final domain, such as `https://fullsquad.app`. It's used for canonical URLs, the sitemap, and social cards.
   - `NEXT_PUBLIC_GA_ID`: your GA4 Measurement ID (`G-XXXXXXX`) to turn on analytics.

## Things to edit before launch

| What | Where |
|---|---|
| Contact email, social links, site URL | `lib/site.ts` |
| FAQ copy (also feeds the FAQ rich results) | `lib/content.ts` |
| Privacy and Terms text (have them reviewed) | `app/privacy/page.tsx`, `app/terms/page.tsx` |
| Social share image | `public/og-image.png` (1200×630) |

## Analytics events (GA4)

`cta_click` (with `cta` and `location`) · `game_post_start` · `game_post_preview` · `game_message_copied` · `waitlist_signup` · `pricing_tier_click` · `billing_toggle` · `calculator_interaction` · `walkthrough_step` · `scroll_depth` (25/50/75/100)

## Project structure

```
app/            layout (fonts, SEO, theme), page, privacy, terms, sitemap, robots
components/     one file per PRD section: Hero, Problem, Solution, Features,
                TimeBackCalculator, Compare, Story, Pricing, Trust, Walkthrough,
                FinalCTA, Footer, plus PostGame (builder dialog), WaitlistForm,
                Nav, and shared ui (RosterMeter, PhoneFrame, …)
components/app/ the app demo (shell, screens, game detail, store)
lib/            site config, content, analytics helper, positions, demo model
public/         icons, manifest, OG image, __forms.html (Netlify form registration)
docs/           market research
```

## Notes on the PRD

- **DaisyUI and Framer Motion were left out.** The brand tokens live in `app/globals.css` as CSS variables, with light and dark themes, and the animations are CSS plus a few small hooks. That keeps the JavaScript bundle small, which helps hit the Lighthouse >90 and 3G load targets. Either library can be added later without restructuring.
- **"Post Your First Game" opens a working post builder**, since the app doesn't exist yet. It produces a copy-ready group-chat message and captures organizer leads with their game details.
- **Hotjar isn't installed.** Add its snippet in `app/layout.tsx` next to the GA4 script if you want heatmaps.
