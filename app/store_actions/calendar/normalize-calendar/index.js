import moment from 'moment'

const utcUnix = timestamp => moment.utc(timestamp * 1000)

/**
 * create a key for the given event
 * @param {Object} event - event
 * @param {Object} fromUnix - start date
 * @param {Object} toUnix - end date
 */
function createEventKey(event, fromUnix, toUnix) {
  const eventTime = utcUnix(event.timestamp)

  if (!event.recurring) {
    return eventTime.format('YYYY-MM-DD')
  }

  const fromDate = utcUnix(fromUnix)
  const toDate = utcUnix(toUnix)
  const year =
    fromDate.year() === toDate.year() || eventTime.month() >= fromDate.month()
      ? fromDate.format('YYYY')
      : toDate.format('YYYY')

  return `${year}-${eventTime.format('MM-DD')}`
}

/**
 * creates days template
 * @param {Object} fromUnix - start date
 * @param {Object} toUnix - end date
 */
function getDays(fromUnix, toUnix) {
  const days = {}
  const cursor = utcUnix(fromUnix)
  const toDate = utcUnix(toUnix)

  while (cursor.isBefore(toDate)) {
    days[cursor.format('YYYY-MM-DD')] = []
    cursor.add(1, 'day')
  }

  return days
}

export function normalizeByDays(fromUnix, toUnix, calendar) {
  const days = getDays(fromUnix, toUnix)

  calendar &&
    calendar.forEach(event => {
      const key = createEventKey(event, fromUnix, toUnix)

      days[key] = [...(days[key] || []), event.id]
    })

  return days
}
