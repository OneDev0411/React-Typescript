/**
 * validate legal prefix
 */
export function isValidLegalPrefix(prefix, requiredFields) {
  if (!prefix && !requiredFields.includes('legal_prefix')) {
    return true
  }

  return ['Mr.', 'Ms.', 'Mrs.', 'Miss', 'Dr.'].includes(prefix)
}
