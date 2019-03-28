export function isValidDate(values, isYearOptional = true) {
  const { day, month, year } = values

  if (day.value == null || month.value == null) {
    return 'Day and Month fields are required.'
  }

  
  if (!isYearOptional && !year) {
    return 'Year is required!'
  }

  if (year && !/(?:(?:18|20)[0-9]{2})/.test(year)) {
    return 'Year is invalid!'
  }
}
