import moment from 'moment'

export function parseDate(date) {
  if (date.length === 0) {
    return 0
  }

  return moment.utc(date).unix()
}