import {
  isLink,
  isEmail,
  isNumber,
  isPhoneNumber,
  validateDateField
} from 'utils/validations'
import { getDateValues } from 'components/inline-editable-fields/InlineDateField/helpers'

const validators = {
  email: isEmail,
  website: isLink,
  linkedin: isLink,
  facebook: isLink,
  instagram: isLink,
  phone_number: isPhoneNumber
}

export function validation(attribute_def, value) {
  if (typeof value === 'string') {
    value = value.trim()
  }

  if (!attribute_def.singular && !value) {
    return 'Invalid input! Enter a value.'
  }

  if (attribute_def.data_type === 'date') {
    if (typeof value === 'number') {
      value = getDateValues(value)
    }

    return validateDateField(value, true)
  }

  if (attribute_def.data_type === 'number') {
    return isNumber(value)
  }

  if (validators[attribute_def.name]) {
    return validators[attribute_def.name](value)
  }
}
