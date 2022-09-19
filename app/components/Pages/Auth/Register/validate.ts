import { isValidPhoneNumber } from '@app/utils/helpers'

import { FormValues } from './types'

const REQUIRED_ERROR = 'Required!'

const isEmptyStr = str => {
  if (!str) {
    return true
  }

  return str.trim().length === 0
}

export async function validate(values: Omit<FormValues, 'user_type'>) {
  const { email, phone_number, first_name, last_name, password } = values
  const errors: Partial<FormValues> = {}

  if (isEmptyStr(first_name)) {
    errors.first_name = REQUIRED_ERROR
  }

  if (isEmptyStr(last_name)) {
    errors.last_name = REQUIRED_ERROR
  }

  if (
    isEmptyStr(phone_number) === false &&
    (await isValidPhoneNumber(phone_number)) === false
  ) {
    errors.phone_number = 'Invalid phone number.'
  }

  if (!phone_number) {
    if (isEmptyStr(email)) {
      errors.email = REQUIRED_ERROR
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email || '')) {
      errors.email = 'Invalid email address.'
    }
  }

  if (!password) {
    errors.password = REQUIRED_ERROR
  } else if (password.length < 6) {
    errors.password = 'Must be at least 6 characters.'
  }

  return errors
}
