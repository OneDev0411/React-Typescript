import { isNumeric } from 'utils/helpers'

export function parseNumberAttribute(attribute) {
  if (attribute.attribute_def.data_type !== 'number') {
    return attribute
  }

  if (attribute.number != null) {
    const number = parseFloat(attribute.number)

    if (isNumeric(number)) {
      return {
        ...attribute,
        number
      }
    }

    return {
      ...attribute,
      number: null
    }
  }

  return attribute
}
