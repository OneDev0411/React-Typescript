/**
 * validate legal prefix
 */
export function isValidLegalPrefix(prefix, requiredFields) {
  if (!prefix && !requiredFields.includes('legal_prefix')) {
    return true
  }

  return ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'].includes(prefix)
}
