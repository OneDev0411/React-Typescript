import { isNumeric } from 'utils/helpers'

export function parseDateValues({ day, month, year }) {
  if (day.value != null && month.value != null) {
    const y = year && isNumeric(year) ? year : 1800

    // UTC time in unix
    return Date.UTC(y, month.value, day.value) / 1000
  }
}
