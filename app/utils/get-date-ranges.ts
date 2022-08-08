import moment from 'moment'

export function getDateRanges() {
  const date = moment()

  const startOfToday = date.clone().startOf('day')
  const endOfToday = date.clone().endOf('day')

  const startOfTomorrow = endOfToday.clone().add(1, 'seconds')
  const endOfTomorrow = endOfToday.clone().add(1, 'days')

  const startOfWeek = date.clone().startOf('isoWeek')
  const endOfWeek = date.clone().endOf('isoWeek')

  const startOfMonth = date.clone().startOf('month')
  const endOfMonth = date.clone().endOf('month')

  const startOfQuarter = date.clone().startOf('quarter')
  const endOfQuarter = date.clone().endOf('quarter')

  return {
    'before-today': {
      label: 'Before Today',
      from: undefined,
      to: startOfToday.toDate()
    },
    today: {
      label: 'Today',
      from: startOfToday.toDate(),
      to: endOfToday.toDate()
    },
    tomorrow: {
      label: 'Tomorrow',
      from: startOfTomorrow.toDate(),
      to: endOfTomorrow.toDate()
    },
    week: {
      label: 'This Week',
      from: startOfWeek.toDate(),
      to: endOfWeek.toDate()
    },
    'next-week': {
      label: 'Next Week',
      from: endOfWeek.clone().add(1, 'seconds').toDate(),
      to: endOfWeek.clone().add(1, 'weeks').toDate()
    },
    'fourteen-days': {
      label: 'Within 14 days',
      from: startOfToday.toDate(),
      to: startOfToday.clone().add(14, 'days').toDate()
    },
    month: {
      label: 'This Month',
      from: startOfMonth.toDate(),
      to: endOfMonth.toDate()
    },
    'next-month': {
      label: 'Next Month',
      from: endOfMonth.clone().add(1, 'seconds').toDate(),
      to: endOfMonth.clone().add(1, 'months').toDate()
    },
    quarter: {
      label: 'This Quarter',
      from: startOfQuarter.toDate(),
      to: endOfQuarter.toDate()
    },
    'next-quarter': {
      label: 'Next Quarter',
      from: endOfQuarter.clone().add(1, 'seconds').toDate(),
      to: endOfQuarter.clone().add(1, 'quarter').toDate()
    }
  }
}
