import { months, addZero } from 'utils/date-times'

export function getDateValues(date) {
  if (!date) {
    return {
      day: { label: 'Day', value: null },
      month: { label: 'Month', value: null },
      year: null
    }
  }

  if (date.day) {
    return date
  }

  const utcDate = new Date(date * 1000)
  const day = utcDate.getUTCDate()
  const month = utcDate.getUTCMonth()
  const year = utcDate.getUTCFullYear()

  return {
    day: { label: addZero(day), value: day },
    month: {
      label: months[month],
      value: month
    },
    year: year === 1800 ? null : year
  }
}
