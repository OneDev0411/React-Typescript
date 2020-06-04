export function isNegativeTimezone(): boolean {
  const date = new Date()
  return date.getTimezoneOffset() > 0
}