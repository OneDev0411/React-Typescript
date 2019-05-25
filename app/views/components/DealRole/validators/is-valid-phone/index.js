/**
 * validate phone number
 */
export async function isValidPhoneNumber(phoneNumber, requiredFields) {
  if (!phoneNumber && !requiredFields.includes('phone_number')) {
    return true
  }

  const {
    PhoneNumberUtil
  } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)
  const phoneUtil = PhoneNumberUtil.getInstance()

  try {
    return phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber, 'US'))
  } catch (e) {
    return false
  }
}
