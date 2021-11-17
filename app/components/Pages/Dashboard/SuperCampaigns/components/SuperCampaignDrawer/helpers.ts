export function convertTimestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

export function convertDateToTimestamp(date: Date): number {
  return date.getTime() / 1000
}

export const requiredTextValidator = (value: string) =>
  !value || value.trim() === '' ? 'This field is required' : undefined
