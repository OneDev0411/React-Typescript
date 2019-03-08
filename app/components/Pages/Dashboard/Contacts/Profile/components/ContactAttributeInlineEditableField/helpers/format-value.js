import { addZero } from 'utils/date-times'
import { formatPhoneNumber } from 'utils/format'

export function formatValue(attribute_def, value) {
  if (value == null || value === '') {
    return
  }

  if (attribute_def.data_type === 'date') {
    const utcDate = new Date(value * 1000)
    const day = utcDate.getUTCDate()
    const month = utcDate.getUTCMonth() + 1
    const _year = utcDate.getUTCFullYear()
    const year = _year === 1800 ? '' : `/${_year}`

    return `${addZero(month)}/${addZero(day)}${year}`
  }

  if (attribute_def.name === 'phone_number') {
    return formatPhoneNumber(value)
  }

  return value
}
