import fecha from 'fecha'

import { setTime } from '../../../utils/set-time'

export function formatDate(date) {
  return fecha.format(date, 'MMM D, YYYY hh:mm A')
}

export function setTimeStringToDate(date, time) {
  // [hours, minutes]
  const timeArray = time.split(':').map(t => parseInt(t, 10))

  return new Date(
    setTime(date).getTime() + timeArray[0] * 3600000 + timeArray[1] * 60000
  )
}

export function isToday(date) {
  return setTime(date) === setTime(new Date())
}
