/**
 * validate address value
 */
export function isValidAddress(address, requiredFields, fieldName) {
  if (address == null && !requiredFields.includes(fieldName)) {
    return true
  }

  return (
    typeof address === 'object' && Object.values(address).join('').length > 0
  )
}
