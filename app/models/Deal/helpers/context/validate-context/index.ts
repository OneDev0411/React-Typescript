import moment from 'moment'

/**
 * validate a context
 */
export function validateContext(
  context: IDealBrandContext,
  value: string,
  required: boolean
) {
  const isNumericField = ['Number', 'Numeric'].includes(context.data_type!)

  if (
    isNumericField === false &&
    (value === undefined || value === null || value.length === 0)
  ) {
    return !required
  }

  switch (context.data_type) {
    case 'Number':
      return value === undefined ||
        value === null ||
        (typeof value === 'string' && value.length === 0)
        ? !required
        : !Number.isNaN(parseFloat(value)) && /^\d*\.?\d*$/.test(value)

    case 'Text':
      return value.length > 0

    case 'Date':
      return validateDate(value)
  }
}

/**
 * validate a date context
 */
export function validateDate(value: string | Date) {
  if (typeof value === 'object' && value instanceof Date) {
    return true
  }

  const date = moment(value)

  return date && date.isValid()
}
