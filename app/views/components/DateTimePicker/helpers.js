import fecha from 'fecha'

import { setTime } from '../../../utils/set-time'

export function formatDate(date, showTime = true) {
  const formatter = showTime ? 'MMM D, YYYY hh:mm A' : 'MMM D, YYYY'

  return date ? fecha.format(date, formatter) : ''
}

export function setTimeStringToDate(date, time) {
  // for handling when date is "" or undefined
  date = date || new Date()

  // [hours, minutes]
  const timeArray = time.split(':').map(t => parseInt(t, 10))
  const output = new Date(
    setTime(date).getTime() + timeArray[0] * 3600000 + timeArray[1] * 60000
  )

  // if the output is Invalid Date, we have a fallback to default date.
  // eslint-disable-next-line
  return isNaN(output) ? date : output
}

export function isToday(date) {
  return setTime(date).getTime() === setTime(new Date()).getTime()
}

// if it's null, returns a date
export function dateFallback(val) {
  return val || new Date()
}

export function pickerSaveButtonText({
  isDateSet,
  hasInitialDate,
  saveButtonText
}) {
  if (isDateSet && hasInitialDate) {
    return 'Update'
  }

  return saveButtonText
}
