export function normalizeCheckboxValue(value) {
  const normalizedValue =
    typeof value === 'string' ? value.trim().toLowerCase() : value

  if (normalizedValue === 'off') {
    return false
  }

  if (normalizedValue === 'on') {
    return true
  }

  return value
}
