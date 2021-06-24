const RANGE_IN_DAYS = 365

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
  rangeInDays: number = RANGE_IN_DAYS
): NumberRange {
  const day = new Date(timestamp)

  const start =
    format === Format.Next
      ? timestamp
      : Date.UTC(
          day.getUTCFullYear(),
          day.getUTCMonth(),
          day.getUTCDate() - rangeInDays,
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
          day.getUTCMonth(),
          day.getUTCDate() + rangeInDays,
          23,
          59,
          59,
          999
        )

  return [start / 1000, end / 1000]
}
