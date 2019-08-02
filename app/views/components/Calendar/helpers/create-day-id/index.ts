export function createDayId(time: Date | number, utc: boolean = true) {
  const date = new Date(typeof time === 'number' ? time : time)

  const year = utc ? date.getUTCFullYear() : date.getFullYear()
  const month = utc ? date.getUTCMonth() + 1 : date.getMonth()
  const day = utc ? date.getUTCDate() : date.getDate()

  return `${year}-${month}-${day}`
}
