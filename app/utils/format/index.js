import moment from 'moment'

export function formatDate(date, pattern = 'MM/DD/YYYY') {
  if (!date) {
    return ''
  }

  const formatedDate = moment.utc(date * 1000).format(pattern)

  return moment(formatedDate).isValid() ? formatedDate : ''
}