const generateVerificationActionRedirectUrl = params => {
  let url = '/verify/confirm/'
  const { action, email, email_code, phone_number, phone_code } = params

  switch (action) {
    case 'EmailVerification':
      url += `email?email=${email}&email_code=${email_code}`
      break
    case 'PhoneVerification':
      // eslint-disable-next-line
        url += `phone?phone_number=${phone_number}&phone_code=${phone_code}`
      break
    default:
      url = '/oops'
      break
  }

  return url
}

export default generateVerificationActionRedirectUrl
