function yearValidator(year: number): boolean {
  return /(?:(?:18|19|20)[0-9]{2})/.test(year.toString(10))
}

interface Select {
  label: string
  value: number | null
}

interface Values {
  day: Select
  month: Select
  year: number | string | null
}

export function validateDateField(
  values: Values,
  isYearOptional: boolean = true,
  validateYear: (y: number) => boolean = yearValidator
): string {
  const { day, month, year } = values

  if (day.value == null || month.value == null) {
    return 'Month and Day fields are required.'
  }


  if (!isYearOptional && !year) {
    return 'Year is required!'
  }

  if (year && !validateYear(Number(year))) {
    return 'Year is invalid!'
  }

  return ''
}
