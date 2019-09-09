/**
 * returns calendar range of upcoming events
 */
export function getUpcomingInitialRange(): NumberRange {
  const today = new Date()

  const start =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      0,
      0
    ).getTime() + today.getTimezoneOffset()

  const end = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth() + 3,
    0, // set to last day of month
    23,
    59,
    59,
    999
  )

  return [start / 1000, end / 1000]
}
