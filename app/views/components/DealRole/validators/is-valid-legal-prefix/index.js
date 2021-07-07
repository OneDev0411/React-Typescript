/**
 * validate legal prefix
 */
export function isValidLegalPrefix(prefix, requiredFields) {
  if (!prefix && !requiredFields.includes('legal_prefix')) {
    return true
  }

  return isValidNameTitle(prefix)
}

export function isValidNameTitle(title) {
  return ['Mr.', 'Ms.', 'Mrs.', 'Miss.', 'Dr.'].includes(title)
}
