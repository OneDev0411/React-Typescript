const DAYS = 365

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
  format: Format = Format.Middle,
  days: number = DAYS
): NumberRange {
  const day = new Date(timestamp)

  const start =
    format === Format.Next
      ? Date.UTC(
          day.getUTCFullYear(),
          day.getUTCMonth(),
          day.getUTCDate(),
          0,
          0,
          0,
          0
        )
      : Date.UTC(
          day.getUTCFullYear(),
          day.getUTCMonth(),
          day.getUTCDate() - days,
          0,
          0,
          0,
          0
        )

  const end =
    format === Format.Previous
      ? Date.UTC(
          day.getUTCFullYear(),
          day.getUTCMonth(),
          day.getUTCDate(),
          0,
          0,
          0,
          0
        )
      : Date.UTC(
          day.getUTCFullYear(),
          day.getUTCMonth(),
          day.getUTCDate() + days,
          23,
          59,
          59,
          999
        )

  return [start / 1000, end / 1000]
}
