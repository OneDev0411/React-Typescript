/**
 * returns calendar range of timeline events
 */
export function getTimelineInitialRange(): NumberRange {
  const today = new Date()

  const start = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth() - 11,
    today.getUTCDate(),
    0,
    0,
    0,
    0
  )

  const end =
    new Date(
      today.getFullYear(),
      today.getMonth() + 6,
      today.getDate(),
      23,
      59,
      59,
      999
    ).getTime() + today.getTimezoneOffset()

  return [start / 1000, end / 1000]
}
