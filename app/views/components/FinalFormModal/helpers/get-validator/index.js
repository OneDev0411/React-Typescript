import {
  isEmail,
  isPhoneNumber,
  isFormatedDate
} from '../../../../../utils/validations'

const validators = {
  date: isFormatedDate,
  email: isEmail,
  phone_number: isPhoneNumber
}

export function getValidator({ attribute_def }) {
  if (attribute_def.data_type === 'date') {
    return validators.date
  }

  if (validators[attribute_def.name]) {
    return validators[attribute_def.name]
  }
}
