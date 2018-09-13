/**
 * Set a fixed time to a Date
 * @param {Date} date The original date
 * @param {number} time Fixed time of day
 * @returns {number} a Date in seconds
 */
export function setTime(date, time) {
  date.setHours(Math.floor(time / 3600))
  date.setMinutes(Math.floor((time % 3600) / 60))
  date.setSeconds(0)
  date.setMilliseconds(0)

  return date
}