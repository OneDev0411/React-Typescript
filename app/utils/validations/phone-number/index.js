export const isPhoneNumber = async value => {
  if (typeof value === 'string' && value.trim()) {
    const errorMessage = 'Invalid US phone number!'

    const {
      PhoneNumberUtil
    } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)
    const phoneUtil = PhoneNumberUtil.getInstance()

    try {
      let phoneNumber = phoneUtil.parse(value, 'US')

      const isValid = await phoneUtil.isValidNumber(phoneNumber)

      if (!isValid) {
        return errorMessage
      }
    } catch (error) {
      return errorMessage
    }
  }
}
