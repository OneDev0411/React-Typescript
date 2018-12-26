import { isValidPhoneNumber } from '../../helpers'

export const isPhoneNumber = async value => {
  const errorMessage = 'Invalid US phone number!'

  const isValid = await isValidPhoneNumber(value)

  if (!isValid) {
    return errorMessage
  }
}
