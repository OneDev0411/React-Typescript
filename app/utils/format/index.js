import moment from 'moment'

export function formatDate(date, pattern = 'MM/DD/YYYY') {
  const formatedDate = moment.utc(date * 1000).format(pattern)

  return moment(formatDate).isValid() ? formatedDate : ''
}