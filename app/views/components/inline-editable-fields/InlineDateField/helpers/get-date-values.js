import { months, addZero } from 'utils/date-times'

export function getDateValues(unixUTC) {
  if (!unixUTC) {
    return {
      day: { label: 'Day', value: null },
      month: { label: 'Month', value: null },
      year: null
    }
  }

  const utcDate = new Date(unixUTC * 1000)
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
