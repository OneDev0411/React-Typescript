export function toUTCDate(date: Date): Date {
  const now = new Date()

  return new Date(date.getTime() + now.getTimezoneOffset() * 60000)
}