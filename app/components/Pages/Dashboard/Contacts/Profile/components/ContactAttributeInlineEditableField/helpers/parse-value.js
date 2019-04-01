import { isNumeric } from 'utils/helpers'

import { parseDateValues } from 'components/inline-editable-fields/InlineDateField/helpers'

export function parseValue(value, attribute_def) {
  // parsing number fields value to a number
  if (attribute_def.data_type === 'number') {
    const number = parseFloat(value)

    if (isNumeric(number)) {
      return number
    }

    return 0
  }

  if (attribute_def.data_type === 'date') {
    return parseDateValues(value)
  }

  if (typeof value === 'string') {
    return value.trim()
  }

  return value
}
