export function validateYear(year) {
  if (year < 1800 || year > new Date().getFullYear()) {
    return false
  }

  return true
}
