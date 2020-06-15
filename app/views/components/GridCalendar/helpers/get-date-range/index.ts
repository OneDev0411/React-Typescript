const MONTH_RANGE = 3

export enum Format {
  Next,
  Middle,
  Previous
}

/**
 * return start and end range of of given time in milliseconds
 * @param timestamp - timestamp in milliseconds
 * @param format - the format of creating range.
 */
export function getDateRange(
  timestamp: number = new Date().getTime(),
  format: Format = Format.Middle
): NumberRange {
  const day = new Date(timestamp)

  const start =
    format === Format.Next
      ? timestamp
      : Date.UTC(
          day.getUTCFullYear(),
          day.getUTCMonth() - MONTH_RANGE,
          day.getUTCDate(),
          0,
          0,
          0,
          0
        )

  const end =
    format === Format.Previous
      ? timestamp
      : Date.UTC(
          day.getUTCFullYear(),
          day.getUTCMonth() + MONTH_RANGE,
          day.getUTCDate(),
          23,
          59,
          59,
          999
        )

  return [start / 1000, end / 1000]
}
/**
 * return start and end range of of given time in milliseconds
 * @param current - timestamp of current range (start or end)
 * @param target - the format of creating range.
 */
export function shouldReCreateRange(current: number, target: number): boolean {
  const currentTimestamp = new Date(current).getTime()
  const targetTimestamp = new Date(target).getTime()
  const diffTime = Math.abs(targetTimestamp - currentTimestamp)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays <= 30
}
