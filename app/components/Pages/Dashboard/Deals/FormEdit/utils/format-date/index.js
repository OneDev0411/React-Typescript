import moment from 'moment'

export function formatDate(date) {
  return moment.utc(date).format('MMM D, YYYY')
}
