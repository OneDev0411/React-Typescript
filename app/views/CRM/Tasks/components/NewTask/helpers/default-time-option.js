import { getTime } from '../../../../../../utils/get-time'
import { getTimes } from '../../../../../../utils/get-times'

/**
 * Generate Default Time optopn for dropdown
 * @param {Date} timestamp The Original date in timestamp
 * @param {string} defaultTime fallback time
 * @returns {object} a time option
 */
export function defaultTimeOption(timestamp, defaultTime) {
  const times = {}

  if (
    timestamp &&
    typeof timestamp === 'number' &&
    new Date(timestamp) !== 'Invalid Date'
  ) {
    getTimes().forEach(time => (times[time.value] = time))

    const time = times[getTime(timestamp)]

    if (time) {
      return time
    }
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
