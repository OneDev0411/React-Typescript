function timezoneOffset(date) {
  return new Date(date).getTimezoneOffset() * 60 * 1000
}

export function getUTC(date) {
  return (
    new Date(date).getTime() - timezoneOffset(date)
  )
}

export function setUTC(date) {
  return (
    new Date(date).getTime() + timezoneOffset(date)
  )
}
