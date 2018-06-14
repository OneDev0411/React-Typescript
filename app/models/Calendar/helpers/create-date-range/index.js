import moment from 'moment'

const RANGE = 4

/**
 * Create range for a day
 * @param {Number} timestamp - timestamp
 */
export function createDayRange(timestamp) {
  const base = moment.unix(timestamp).utcOffset(0)

  const start = moment(base)
    .startOf('day')
    .format('X')

  const end = moment(base)
    .endOf('day')
    .format('X')

  return [start, end]
}

/**
 * Create range for previous days
 * @param {Number} startRange - timestamp
 */
export function createPastRange(startRange) {
  const base = moment.unix(startRange).utcOffset(0)

  const start = moment(base)
    .subtract(RANGE, 'day')
    .startOf('day')
    .format('X')

  const end = moment(base)
    .endOf('day')
    .format('X')

  return [start, end]
}

/**
 * Create range for future days
 * @param {Number} endRange  - timestamp
 */
export function createFutureRange(endRange) {
  const base = moment.unix(endRange).utcOffset(0)

  const start = moment(base)
    .add(1, 'day')
    .startOf('day')
    .format('X')

  const end = moment
    .unix(start)
    .add(RANGE, 'day')
    .endOf('day')
    .format('X')

  return [start, end]
}

/**
 * create a date range
 * @param {Object} date - the Date object
 * @param {Object} options - the options
 */
export function createDateRange(date, options = {}) {
  const base = moment(date).utcOffset(0)
  const range = options.range || RANGE

  const start = moment(base)
    .subtract(range, 'day')
    .startOf('day')
    .format('X')

  const end = moment
    .unix(start)
    .add(range * 2, 'day')
    .endOf('day')
    .format('X')

  return [start, end]
}
