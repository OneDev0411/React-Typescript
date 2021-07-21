export function isValidDate(date: any): boolean {
  // eslint-disable-next-line no-restricted-globals
  return isFinite(date) && date instanceof Date
}
