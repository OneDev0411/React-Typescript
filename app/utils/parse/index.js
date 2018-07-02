export function parseDate(date) {
  return date => moment.utc(date).unix()
}