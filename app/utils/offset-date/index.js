/**
 *
 * @param {number} timestamp original date in timestamp ms
 * @param {number} offset offset in days
 * @returns {number} a timestamp ms
 */
export function offsetDate(timestamp, offset) {
  return timestamp + offset * 24 * 3600 * 1000
}
