import {
  isEmail,
  isFormatedDate,
  isPhoneNumber,
  isNumber
} from 'utils/validations'

const validators = {
  date: isFormatedDate,
  email: isEmail,
  number: isNumber,
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
    return validators.date(value)
  }

  if (attribute_def.data_type === 'number') {
    return validators.number(value)
  }

  if (validators[attribute_def.name]) {
    return validators[attribute_def.name](value)
  }
}
