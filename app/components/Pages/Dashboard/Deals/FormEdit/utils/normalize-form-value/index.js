import { formatDate } from '../format-date'

export function normalizeFormValue(context, value) {
  if (!context || !value) {
    return value
  }

  if (context.data_type === 'Number') {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  if (context.data_type === 'Date') {
    return formatDate(isNaN(value) ? value : value * 1000)
  }

  return value
}
