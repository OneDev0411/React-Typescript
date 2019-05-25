import fecha from 'fecha'

export function formatDate(date) {
  return fecha.format(new Date(date), 'MMM D, YYYY')
}
