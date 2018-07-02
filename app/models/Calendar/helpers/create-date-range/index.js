import moment from 'moment'

const RANGE = 4

/**
 * Create range for a day
 * @param {Number} timestamp - timestamp
 */
export function createDayRange(timestamp) {
  const base = moment.unix(timestamp)

  const start = moment(base)
    .utcOffset(0)
    .startOf('day')
    .format('X')

  const end = moment(base)
    .utcOffset(0)
    .endOf('day')
    .format('X')

  return [start, end]
}

/**
 * Create range for previous days
 * @param {Number} startRange - timestamp
 */
export function createPastRange(startRange) {
  const base = moment.unix(startRange)

  const start = moment(base)
    .utcOffset(0)
    .subtract(RANGE * 5, 'day')
    .startOf('day')
    .format('X')

  const end = moment(base)
    .utcOffset(0)
    .endOf('day')
    .format('X')

  return [start, end]
}

/**
 * Create range for future days
 * @param {Number} endRange  - timestamp
 */
export function createFutureRange(endRange) {
  const base = moment.unix(endRange)

  const start = moment(base)
    .utcOffset(0)
    .add(1, 'day')
    .startOf('day')
    .format('X')

  const end = moment
    .unix(start)
    .utcOffset(0)
    .add(RANGE * 5, 'day')
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
  const base = moment(date)
  const range = options.range || RANGE

  const start = moment(base)
    .utcOffset(0)
    .subtract(range, 'day')
    .startOf('day')
    .format('X')

  const end = moment
    .unix(start)
    .utcOffset(0)
    .add(range * 2, 'day')
    .endOf('day')
    .format('X')

  return [start, end]
}
