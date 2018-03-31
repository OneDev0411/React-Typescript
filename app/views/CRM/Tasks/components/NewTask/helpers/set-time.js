/**
 * Set a fixed time to a Date
 * @param {Date} timestamp The Original date in timestamp
 * @param {number} time Fixed time of day
 * @returns {number} a timestamp time in seconds
 */
export function setTime(timestamp, time) {
  const newDate = new Date(timestamp)

  newDate.setHours(Math.floor(time / 3600))
  newDate.setMinutes(Math.floor((time % 3600) / 60))
  newDate.setSeconds(0)

  return newDate.getTime()
}
