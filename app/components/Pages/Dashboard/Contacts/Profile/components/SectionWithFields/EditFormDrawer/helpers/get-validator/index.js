import {
  isEmail,
  isFormatedDate,
  isPhoneNumber,
  isNumber
} from '../../../../../../../../../../utils/validations'

const validators = {
  date: isFormatedDate,
  email: isEmail,
  number: isNumber,
  phone_number: isPhoneNumber
}

export function getValidator({ attribute_def }) {
  if (attribute_def.data_type === 'date') {
    return validators.date
  }

  if (attribute_def.data_type === 'number') {
    return validators.number
  }

  if (validators[attribute_def.name]) {
    return validators[attribute_def.name]
  }
}
