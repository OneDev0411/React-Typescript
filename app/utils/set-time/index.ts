/**
 * Set a fixed time to a Date
 * @param {Date} date The original date
 * @param {number} time Fixed time of day
 * @returns {number} a Date in seconds
 */
export function setTime(date: Date | number, time: number = 0): Date {
  // prevent from overriding the reference date object
  const datetime = new Date(date)
  
  datetime.setHours(Math.floor(time / 3600))
  datetime.setMinutes(Math.floor((time % 3600) / 60))
  datetime.setSeconds(0)
  datetime.setMilliseconds(0)

  return datetime
}