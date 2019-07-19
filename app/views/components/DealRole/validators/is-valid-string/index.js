/**
 * validate string value
 */
export function isValidString(str, requiredFields, fieldName) {
  if (!str && !requiredFields.includes(fieldName)) {
    return true
  }

  return str && str.trim().length > 0
}
