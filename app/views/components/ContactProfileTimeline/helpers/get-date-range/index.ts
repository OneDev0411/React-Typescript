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
// TODO: move this helper to the grid calendar since it's not useable for timeline
export function getDateRange(
  timestamp: number = new Date().getTime(),
  format: Format = Format.Middle,
  days: number = DAYS
): ICalendarRange {
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

  return { low: start / 1000, high: end / 1000 }
}

/**
 * return proper timestamp for sending request
 * It will use when we're using limit param in calendar api.
 * NOTE: it consist of some hack (tof) due some api limit
 * @param event - the event
 */
export function getDateRangeFromEvent(
  event: ICalendarEvent,
  direction: Format
): number {
  const timestamp = event.recurring ? event.sort_timestamp : event.timestamp
  const date = new Date(timestamp * 1000)

  const range = date.getTime() / 1000

  if (direction === Format.Next) {
    return range + 1 // avoid covering last event on the next response.
  }

  return range - 1 // avoid covering last event on the next response.
}
