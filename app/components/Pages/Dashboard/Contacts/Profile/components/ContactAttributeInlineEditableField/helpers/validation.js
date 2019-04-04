import {
  isEmail,
  isValidDate,
  isPhoneNumber,
  isNumber
} from 'utils/validations'

import { validateYear } from './validate-year'

const validators = {
  email: isEmail,
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
    return isValidDate(value, true, validateYear)
  }

  if (attribute_def.data_type === 'number') {
    return isNumber(value)
  }

  if (validators[attribute_def.name]) {
    return validators[attribute_def.name](value)
  }
}
