import { isNumeric } from 'utils/helpers'

export function formatPreSave(attribute, value) {
  let result
  let newValue
  let previousValue
  const { attribute_def } = attribute
  const type = attribute_def.data_type

  if (typeof value === 'string') {
    newValue = value.trim()
  } else {
    newValue = ''
  }

  if (newValue === previousValue) {
    newValue = undefined
  }

  if (attribute.id) {
    if (newValue != null) {
      result = {
        attribute_def,
        id: attribute.id,
        [type]: newValue
      }
    }
  } else if (newValue) {
    result = {
      attribute_def,
      [type]: newValue
    }
  }

  // for parsing number fields

  if (result.number != null) {
    const number = parseFloat(attribute.number)

    if (isNumeric(number)) {
      result = {
        ...result,
        number
      }
    }

    result = {
      ...result,
      number: null
    }
  }

  return result
}
