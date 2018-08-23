import fecha from 'fecha'

import { getTime } from '../get-time'
import { getTimes } from '../get-times'

/**
 * Generate Default Time optopn for dropdown
 * @param {Date} date The Original date in timestamp
 * @param {string} defaultTime fallback time
 * @returns {object} a time option
 */
export function defaultTimeOption(date, defaultTime) {
  const times = {}

  if (date && typeof date === 'number' && new Date(date) !== 'Invalid Date') {
    getTimes().forEach(time => (times[time.value] = time))

    const value = getTime(date)
    let time = times[value]

    if (time) {
      return time
    }

    return { title: fecha.format(new Date(date), 'hh:mm A'), value }
  }

  if (defaultTime) {
    getTimes().forEach(time => (times[time.title] = time))

    const time = times[defaultTime]

    if (time) {
      return time
    }
  }

  return { title: 'Add time', value: null }
}
