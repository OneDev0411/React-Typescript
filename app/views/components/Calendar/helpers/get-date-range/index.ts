const DAY_RANGE = 200

export enum Format {
  TopRange,
  MiddleRange,
  BottomRange
}

/**
 * return start and end range of of given time in milliseconds
 * @param timestamp - timestamp in milliseconds
 * @param format - the format of creating range.
 */
export function getDateRange(
  timestamp: number = new Date().getTime(),
  format: Format = Format.MiddleRange
): [number, number] {
  const day = new Date(timestamp)

  const topRange = format === Format.BottomRange ? 0 : DAY_RANGE
  const bottomRange = format === Format.TopRange ? 0 : DAY_RANGE

  const start =
    Date.UTC(
      day.getUTCFullYear(),
      day.getUTCMonth() + 1,
      day.getUTCDate() - bottomRange,
      0,
      0,
      0,
      0
    ) / 1000

  const end =
    Date.UTC(
      day.getUTCFullYear(),
      day.getUTCMonth() + 1,
      day.getUTCDate() + topRange,
      23,
      59,
      59,
      999
    ) / 1000

  return [start, end]
}
