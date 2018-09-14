/**
 * Set a fixed time to a Date
 * @param {Date} date The original date
 * @param {number} time Fixed time of day
 * @returns {number} a Date in seconds
 */
export function setTime(date, time = 0) {
  // prevent from overriding the reference date object
  const _date = new Date(date)
  
  _date.setHours(Math.floor(time / 3600))
  _date.setMinutes(Math.floor((time % 3600) / 60))
  _date.setSeconds(0)
  _date.setMilliseconds(0)

  return _date
}