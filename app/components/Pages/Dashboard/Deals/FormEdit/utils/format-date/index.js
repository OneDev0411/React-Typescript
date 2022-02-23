import moment from 'moment'

export function formatDate(date, format) {
  return moment.utc(date).format(format || 'MMMM DD, YYYY')
}
