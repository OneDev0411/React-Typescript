import moment from 'moment'

export function formatDate(date, pattern = 'MM/DD/YYYY') {
  if (moment.invalid(date)) {
    return date
  }

  return moment.utc(date * 1000).format(pattern)
}