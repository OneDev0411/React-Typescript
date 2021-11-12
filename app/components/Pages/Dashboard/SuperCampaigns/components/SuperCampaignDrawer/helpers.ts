export function convertTimestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

export function convertDateToTimestamp(date: Date): number {
  return date.getTime() / 1000
}
