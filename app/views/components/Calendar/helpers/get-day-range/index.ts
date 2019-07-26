/**
 * return first and last milliseconds of given day
 * @param timestamp - timestamp in milliseconds
 */
export function getDayRange(
  timestamp: number = new Date().getTime()
): DateRange {
  const day = new Date(timestamp)

  const start =
    Date.UTC(
      day.getUTCFullYear(),
      day.getUTCMonth(),
      day.getUTCDate(),
      0,
      0,
      0,
      0
    ) / 1000

  return [start, start + 863999]
}
