import moment from 'moment'

export function formatDate(date, format = '‍DD MMMM, YYYY‍') {
  return moment.utc(date).format(format)
}
