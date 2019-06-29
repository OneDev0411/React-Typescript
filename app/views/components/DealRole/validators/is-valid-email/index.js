/**
 * validate email
 */
export function isValidEmail(email, requiredFields, fieldName) {
  if (!email && !requiredFields.includes(fieldName)) {
    return true
  }

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return re.test(email)
}
