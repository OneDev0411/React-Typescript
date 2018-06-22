export function createUTCDate(timestamp) {
  const offset = new Date().getTimezoneOffset() * 60
  const utc = ~~timestamp + offset

  return new Date(utc * 1000)
}
