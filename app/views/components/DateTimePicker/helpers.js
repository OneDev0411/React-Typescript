import fecha from 'fecha'

import { setTime } from '../../../utils/set-time'

function formatDate(date) {
  return date ? fecha.format(date, 'MMM D, YYYY hh:mm A') : ''
}

function setTimeStringToDate(date = new Date(), time) {
  // [hours, minutes]
  const timeArray = time.split(':').map(t => parseInt(t, 10))

  return new Date(
    setTime(date).getTime() + timeArray[0] * 3600000 + timeArray[1] * 60000
  )
}

function isToday(date) {
  return setTime(date).getTime() === setTime(new Date()).getTime()
}

// if it's null, returns a date
function dateFallback(val) {
  return val || new Date()
}

function pickerSaveButtonText({ isDateSet, hasInitialDate, saveButtonText }) {
  if (isDateSet && hasInitialDate) {
    return 'Update'
  }

  return saveButtonText
}

export {
  formatDate,
  setTimeStringToDate,
  isToday,
  dateFallback,
  pickerSaveButtonText
}
