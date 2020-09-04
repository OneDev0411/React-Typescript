export function isValidDate(date: any): boolean {
  return isFinite(date) && date instanceof Date
}