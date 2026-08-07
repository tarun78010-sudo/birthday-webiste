# A Reveal Is Coming — Birthday Website

A premium, cinematic birthday microsite. Dark, glassy, and quiet until the
moment it isn't. Built with React + Vite, Tailwind CSS, and Framer Motion.

## How it works

- On open, a 3-second cinematic **loading sequence** plays
  ("Initializing..." → "Preparing something special..." → "Almost Ready...")
  before anything else renders.
- Before the reveal date, visitors then only ever see the **countdown
  page** — a neon-glass card, a glowing chronograph-style ring, and a
  live countdown. No birthday content, including the name, is rendered
  or sent to the browser's visible DOM before unlock.
- The instant the reveal date passes (checked client-side, every second,
  no page reload needed), the app fades to black and lifts into a
  cinematic **name reveal**. The rest of the birthday experience (the
  letter, the timeline, the closing note) is intentionally deferred —
  the content is already reserved in `src/config.js` for a later pass.
- There's no password and no button — it's purely time-based.

## Quick start

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Customize it

Everything you're likely to want to change lives in one file:

**`src/config.js`**
- `REVEAL_DATE` — the exact local date/time the celebration unlocks.
- `SITE.name` — the birthday person's name. Never rendered before unlock.
- `SITE.teaserHeadline` / `teaserSub` / `teaserLine` — countdown page copy.
- `SITE.celebrationHeadline` — paired with `SITE.name` in the reveal moment.
- `SITE.letter`, `SITE.moments`, `SITE.closing` — reserved for the fuller
  birthday experience; not yet rendered by `CelebrationPage.jsx`.

No other files need to change for basic personalization.

### To test the unlock without waiting

Temporarily set `REVEAL_DATE` in `src/config.js` to a few minutes in the
future, save, and watch the transition happen live. Set it back before
deploying.

## Project structure

```
src/
  App.jsx                     # loading → countdown vs. celebration, owns the fades
  config.js                   # ← your content lives here
  index.css                   # global styles, fonts, tailwind layer
  hooks/
    useCountdown.js           # live countdown + ring progress calculation
  components/
    LoadingScreen.jsx         # 3s cinematic boot sequence
    CountdownPage.jsx         # the "before" experience (mouse-parallax glass card)
    CelebrationPage.jsx       # fade-to-black → name reveal (more to come later)
    ApertureRing.jsx          # signature chronograph progress ring
    CountdownUnit.jsx         # single glowing digit block, neon hover
    AmbientGlow.jsx           # aurora blobs, twinkling stars, light rays
    ParticleField.jsx         # canvas particle drift
```

## Design notes

- Palette: background `#050816`, surface `#0B1023`, neon purple `#8B5CF6`,
  accent purple `#A855F7`, soft violet `#C084FC`, ivory `#F8FAFC`, muted
  gray `#94A3B8` — purple-only, no rainbow color, no hearts, no cartoon assets.
- Type: Space Grotesk for display headlines, Inter for body copy, IBM
  Plex Mono for countdown digits and small-caps labels (chronograph feel).
- Motion respects `prefers-reduced-motion` throughout (particles render a
  static frame, transitions still occur but instantly).
- Fully responsive, mobile-first; the aperture ring repositions itself
  behind the countdown digits on small screens instead of framing the card.

## Deploy to Vercel

```bash
npm run build
```

Then either:

1. Push this folder to a GitHub repo and import it in Vercel — it will
   auto-detect Vite and use `vercel.json` for the SPA rewrite, or
2. Run `npx vercel` from this folder and follow the prompts.

No environment variables are required.
