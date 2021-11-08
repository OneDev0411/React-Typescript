import moment from 'moment'

export function convertUnixtimeToUtc(date: string | number): Date {
  const base =
    typeof date === 'number' ? moment.unix(date).utc() : moment(date).utc()

  return moment(base.format('MMM DD, YYYY')).toDate()
}
