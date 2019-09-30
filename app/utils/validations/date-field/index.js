export const validateYear = year => /(?:(?:18|19|20)[0-9]{2})/.test(year)

export function isValidDate(
  values,
  isYearOptional = true,
  validateYear = validateYear
) {
  const { day, month, year } = values

  if (day.value == null || month.value == null) {
    return 'Day and Month fields are required.'
  }

  
  if (!isYearOptional && !year) {
    return 'Year is required!'
  }

  if (year && !validateYear(Number(year))) {
    return 'Year is invalid!'
  }
}
