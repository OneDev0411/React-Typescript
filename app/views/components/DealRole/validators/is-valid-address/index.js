/**
 * validate address value
 */
export function isValidAddress(address, requiredFields, fieldName) {
  if ((!address || !address.full) && !requiredFields.includes(fieldName)) {
    return true
  }

  return address.full.length > 0
}
