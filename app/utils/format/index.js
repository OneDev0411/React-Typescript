import { format } from 'fecha'

export function formatDate(date, pattern) {
  if (!date || new Date(date) === 'Invalid date') {
    return ''
  }

  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000

  return format(date * 1000 - timezoneOffset, 'MM/DD/YYYY')
}