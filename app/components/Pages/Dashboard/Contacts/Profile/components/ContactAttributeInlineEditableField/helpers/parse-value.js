import { isNumeric } from 'utils/helpers'

export function parseValue(value, attribute_def) {
  // parsing number fields value to a number
  if (attribute_def.data_type === 'number') {
    const number = parseFloat(value)

    if (isNumeric(number)) {
      return number
    }

    return 0
  }

  return value
}
