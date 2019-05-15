/**
 * validate commission value
 */
export function isValidCommission(commission, requiredFields) {
  if (!commission && !requiredFields.includes('commission')) {
    return true
  }

  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(parseFloat(commission)) && isFinite(commission)) {
    return true
  }

  return false
}
