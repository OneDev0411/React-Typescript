export function normalizeCheckboxValue(value) {
  const normalizedValue =
    typeof value === 'string' ? value.trim().toLowerCase() : value

  if (['off', 'no'].includes(normalizedValue)) {
    return false
  }

  return Boolean(value)
}
