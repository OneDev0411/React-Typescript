import { isValidPhoneNumber } from '../../helpers'

export const isPhoneNumber = async value => {
  if (!value || !value.trim())
    return

  const errorMessage = 'Invalid US phone number!'

  const isValid = await isValidPhoneNumber(value)

  if (!isValid) {
    return errorMessage
  }
}
