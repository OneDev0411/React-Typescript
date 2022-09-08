import { isValidPhoneNumber } from '../../helpers'

export const isPhoneNumber = async value => {
  if (!value || !value.trim()) {
    return
  }

  const errorMessage = 'Invalid Phone Number!'

  const isValid = await isValidPhoneNumber(value)

  if (!isValid) {
    return errorMessage
  }
}
