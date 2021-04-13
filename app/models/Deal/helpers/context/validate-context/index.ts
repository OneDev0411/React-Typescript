import moment from 'moment'

/**
 * validate a context
 */
export function validateContext(ctx: IDealBrandContext, value: string) {
  const isNumericField = ['Number', 'Numeric'].includes(ctx.data_type)

  if (
    isNumericField === false &&
    (value === undefined || value === null || value.length === 0)
  ) {
    return !ctx.mandatory
  }

  switch (ctx.data_type) {
    case 'Number':
    case 'Numeric':
      return _.isUndefined(value) ||
        value === null ||
        (typeof value === 'string' && value.length === 0)
        ? !ctx.mandatory
        : !Number.isNaN(parseFloat(value)) && /^\d*\.?\d*$/.test(value)

    case 'String':
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
