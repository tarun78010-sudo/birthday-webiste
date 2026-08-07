import { useEffect, useMemo, useState } from 'react'

const DAY = 86400000
const HOUR = 3600000
const MINUTE = 60000

export function useCountdown(targetDate) {
  const target = useMemo(() => targetDate.getTime(), [targetDate])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (now >= target) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [now, target])

  const diff = Math.max(target - now, 0)
  const isComplete = diff <= 0

  const days = Math.floor(diff / DAY)
  const hours = Math.floor((diff % DAY) / HOUR)
  const minutes = Math.floor((diff % HOUR) / MINUTE)
  const seconds = Math.floor((diff % MINUTE) / 1000)

  // Progress across a rolling 30-day approach window, used to fill the
  // aperture ring gradually rather than jumping straight to full.
  const WINDOW = 30 * DAY
  const windowStart = target - WINDOW
  const progress = isComplete
    ? 1
    : Math.min(Math.max((now - windowStart) / WINDOW, 0), 1)

  return { days, hours, minutes, seconds, isComplete, progress }
}
