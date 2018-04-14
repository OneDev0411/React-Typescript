import fecha from 'fecha'
import { setTime } from './set-time'

/**
 * Creating date field options
 * @param {Date} baseDate The base date in timestamp
 * @param {Date} destinationDate The Destination time in timestamp
 * @returns {object} a date option contains its title and value
 */
export function createDateOptions(baseDate, destinationDate, type) {
  baseDate = setTime(baseDate, 0)
  destinationDate = setTime(destinationDate, 0)

  const differenceDays = Math.round(
    (baseDate - destinationDate) / (24 * 3600 * 1000)
  )

  const formatedDate = date => fecha.format(new Date(date), 'MM/DD/YYYY')

  const getReminderDateTitle = () => {
    switch (differenceDays) {
      case 0:
        return 'The day of'
      case 1:
        return 'The day before'
      case 7:
        return 'The week before'
      default:
        return formatedDate(destinationDate)
    }
  }

  const getDueDateTitle = () => {
    switch (differenceDays) {
      case 0:
        return 'Today'
      case -1:
        return 'Tomorrow'
      default:
        return formatedDate(destinationDate)
    }
  }

  let title

  if (type === 'reminder') {
    title = getReminderDateTitle(differenceDays)
  }

  if (type === 'due-date') {
    title = getDueDateTitle(differenceDays)
  }

  return { title, value: destinationDate }
}
