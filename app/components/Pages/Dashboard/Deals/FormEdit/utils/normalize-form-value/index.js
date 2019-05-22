import { formatDate } from '../format-date'
import { contextOverwriteValues } from '../context-overwrite-values'

export function normalizeFormValue(annotation, context, value, formValue = '') {
  if (
    !context ||
    !value ||
    annotation.disableAutopopulate ||
    contextOverwriteValues.includes(formValue)
  ) {
    return formValue
  }

  if (context.data_type === 'Number') {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  if (context.data_type === 'Date') {
    return formatDate(isNaN(value) ? value : value * 1000)
  }

  return value
}
