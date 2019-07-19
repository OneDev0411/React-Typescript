import { isNumeric } from 'utils/helpers'
import { formatPhoneNumber } from 'utils/format'
import { addZero, months_abbr } from 'utils/date-times'

export function formatValue(attribute_def, value) {
  if (value == null || value === '') {
    return
  }

  if (attribute_def.data_type === 'date') {
    if (isNumeric(value)) {
      const utcDate = new Date(value * 1000)
      const day = utcDate.getUTCDate()
      const month = months_abbr[utcDate.getUTCMonth()]
      const _year = utcDate.getUTCFullYear()
      const year = _year === 1800 ? '' : `, ${_year}`

      return `${month} ${addZero(day)}${year}`
    }

    const { day, month } = value

    if (day.value == null || month.value == null) {
      return
    }

    let { year } = value

    year = year === 1800 || !year ? '' : `, ${year}`

    return `${months_abbr[month.value]} ${addZero(day.value)}${year}`
  }

  if (attribute_def.name === 'phone_number') {
    return formatPhoneNumber(value)
  }

  return value
}
