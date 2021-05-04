/**
 * Set a fixed time to a Date
 * @param {Date} date The original date
 * @param {number} time Fixed time of day (seconds passed since day start)
 * @returns {number} a Date
 */
export function setTime(date: Date | number, time: number = 0): Date {
  // prevent from overriding the reference date object
  const dateTime = new Date(date)
  
  dateTime.setHours(Math.floor(time / 3600))
  dateTime.setMinutes(Math.floor((time % 3600) / 60))
  dateTime.setSeconds(0)
  dateTime.setMilliseconds(0)

  return dateTime
}
