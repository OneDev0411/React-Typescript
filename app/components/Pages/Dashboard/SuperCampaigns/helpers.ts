/**
 * A helper function to calc the time difference between due at and current time
 * @param dueAt
 * @returns Return the time difference in milliseconds
 */
export function getSuperCampaignDueAtRemainingTimeInMilliSeconds(
  dueAt: number
): number {
  const currentTime = new Date().getTime()

  return dueAt * 1000 - currentTime
}

export function convertTimestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

export function convertDateToTimestamp(date: Date): number {
  return date.getTime() / 1000
}
