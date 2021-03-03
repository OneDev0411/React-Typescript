export const ONE_DAY_IN_SECONDS = 86400
export const ONE_HOUR_IN_SECONDS = 3600
export const ONE_MINUTE_IN_SECONDS = 60

// Returns number of another bases and remaining seconds
function secondsToAnotherBase(seconds: number, base: number): [number, number] {
  const anotherBase = Math.floor(seconds / base)
  const remainingSeconds = seconds % base

  return [anotherBase, remainingSeconds]
}

// Returns number of days and remaining seconds
export function secondsToDays(seconds: number): [number, number] {
  return secondsToAnotherBase(seconds, ONE_DAY_IN_SECONDS)
}

// Returns number of hours and remaining seconds
function secondsToHours(seconds: number): [number, number] {
  return secondsToAnotherBase(seconds, ONE_HOUR_IN_SECONDS)
}

// Returns number of minutes and remaining seconds
function secondsToMinutes(seconds: number): [number, number] {
  return secondsToAnotherBase(seconds, ONE_MINUTE_IN_SECONDS)
}

interface HumanizedTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Returns humanized object of seconds
export function humanizeSeconds(seconds: number): HumanizedTime {
  const [days, remainingSecondsFromDays] = secondsToDays(seconds)
  const [hours, remainingSecondsFromHours] = secondsToHours(
    remainingSecondsFromDays
  )
  const [minutes, remainingSecondsFromMinutes] = secondsToMinutes(
    remainingSecondsFromHours
  )

  return {
    days,
    hours,
    minutes,
    seconds: remainingSecondsFromMinutes
  }
}

export function formatTimeDigits(digits: number): string {
  if (digits > 9) {
    return digits.toString()
  }

  return `0${digits}`
}

export function timeToSeconds(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * ONE_HOUR_IN_SECONDS + minutes * ONE_MINUTE_IN_SECONDS
}
