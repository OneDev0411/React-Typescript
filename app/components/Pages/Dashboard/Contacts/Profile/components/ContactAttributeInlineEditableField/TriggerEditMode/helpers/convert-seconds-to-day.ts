/**
 * server return second but we need day so this convert the seconds
 * @param {number | string} seconds - all attributes definitions
 */

export const convertSecondsToDay = (seconds: number | string): number => {
  if (!seconds) {
    return 0
  }

  return Math.abs(Number(seconds)) / 86400
}
