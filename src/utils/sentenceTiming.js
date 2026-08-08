// Shared timing logic for the "one sentence at a time" fade sequences
// (CinematicIntro's whispered lines, BirthdayHomePage's story lines).
// Reading time now scales with how much there is to read, instead of
// every sentence getting the same fixed duration on screen.

export const FADE_SECONDS = 0.8
export const GAP_SECONDS = 0.5

// Word-count buckets, each with its own hold-time range. Duration is
// interpolated within a bucket so a 2-word line and a 4-word line
// (both "short") don't get identical treatment.
function clamp01(t) {
  return Math.min(Math.max(t, 0), 1)
}

export function getHoldSeconds(text, { important = false } = {}) {
  const words = text.trim().split(/\s+/).filter(Boolean).length

  if (important) {
    // Important lines (e.g. the date) always get the slowest,
    // most-deliberate hold, regardless of how short the text is.
    return 4.5 + clamp01((words - 1) / 10) * 0.5
  }
  if (words <= 4) {
    // Short: 2.5–3s
    return 2.5 + clamp01((words - 1) / 3) * 0.5
  }
  if (words <= 9) {
    // Medium: 3.5–4s
    return 3.5 + clamp01((words - 5) / 4) * 0.5
  }
  // Important by length (10+ words): 4.5–5s
  return 4.5 + clamp01((words - 10) / 6) * 0.5
}

// Total time a line is animating: fade in + hold + fade out.
export function getLineDuration(text, opts) {
  return FADE_SECONDS + getHoldSeconds(text, opts) + FADE_SECONDS
}

// The four `times` keyframes for opacity/blur ([0, 1, 1, 0]-style
// animations), scaled so the fade portions are always exactly
// FADE_SECONDS regardless of the line's total duration.
export function getLineTimes(duration) {
  const fadeFraction = FADE_SECONDS / duration
  return [0, fadeFraction, 1 - fadeFraction, 1]
}

// Lays a list of { text, ... } lines out one after another, each
// starting GAP_SECONDS after the previous one has fully faded out.
// Returns the lines with `delay`, `duration`, and `times` attached,
// plus the cursor position (useful for scheduling what comes next).
export function layoutSequence(lines, start, gap = GAP_SECONDS) {
  let cursor = start
  const laidOut = lines.map((line) => {
    const opts = { important: Boolean(line.important || line.isDate) }
    const duration = getLineDuration(line.text, opts)
    const delay = cursor
    cursor += duration + gap
    return { ...line, delay, duration, times: getLineTimes(duration) }
  })
  return { lines: laidOut, cursor }
}
