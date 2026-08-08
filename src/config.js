// ─────────────────────────────────────────────────────────────
// Everything you need to personalize lives in this file.
// ─────────────────────────────────────────────────────────────

// The exact moment the celebration unlocks.
// Format: 'YYYY-MM-DDTHH:mm:ss' — interpreted in the visitor's local time.
// Change the year if you're testing this in a future year.
export const REVEAL_DATE = new Date('2026-08-10T00:00:00')

export const SITE = {
  // Shown on the countdown page. The name must never appear here.
  teaserEyebrow: 'Exclusive Experience',
  teaserHeadline: 'A Surprise Awaits',
  teaserSub: 'Just a Few Days to Go...',

  // Revealed only after the countdown completes.
  name: 'Komali',
  celebrationEyebrow: 'The wait is over',
  celebrationHeadline: 'Happy Birthday,',

  // NOTE: the sections below (letter / moments / closing) are reserved
  // for the full birthday experience, which will be built out in a
  // later pass. CelebrationPage.jsx currently only renders the
  // fade-to-black → name reveal moment and does not use these yet.
  celebrationSub: 'One more year, written in light.',

  // Used by the Phase 2 cinematic intro (CinematicIntro.jsx) — the
  // three whispered lines shown one at a time, then the closing
  // subtitle and button beneath the name reveal.
  cinematicLines: ['A little surprise...', 'Created with care...', 'For someone special today...'],
  celebrationSubtitle: 'Today is all about celebrating you.',
  journeyButtonLabel: '✨ Begin the Journey',
  letter: [
    "Some people move through the world quietly making it better — for the people beside them, and for everyone lucky enough to be in their orbit.",
    "This is one small page to mark the day it started. Not because a day needs marking, but because you do.",
    "Here's to the year ahead — may it hold exactly as much as you hope for, and a little you didn't expect.",
  ],
  moments: [
    { year: '01', title: 'The beginning', copy: 'Every story needs a first page. This was yours.' },
    { year: '02', title: 'The becoming', copy: 'Every year since has added something worth keeping.' },
    { year: '03', title: 'Today', copy: 'A new chapter opens — written by you, as always.' },
  ],
  closing: 'Made with care, for you.',
}
