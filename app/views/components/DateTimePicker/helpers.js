import fecha from 'fecha'

import { setTime } from '../../../utils/set-time'

export const today = new Date()

export function formatDate(date) {
  const formatedDate = fecha.format(date, 'MMM D, YYYY hh:mm A')

  return `${isToday(date)}${formatedDate}`
}

export function setTimeStringToDate(date, time) {
  // [hours, minutes]
  const timeArray = time.split(':').map(t => parseInt(t, 10))

  return new Date(
    setTime(date, 0).getTime() + timeArray[0] * 3600000 + timeArray[1] * 60000
  )
}

export function isToday(date) {
  if (setTime(date).getTime() === setTime(today).getTime()) {
    return 'Today, '
  }

  return ''
}
