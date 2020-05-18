import fecha from 'fecha'

const NONE_OPTION = { title: 'None', value: -1 }

const REMINDER_ITEMS = {
  0: 'At the time of event',
  300000: '5 Minutes Before',
  900000: '15 Minutes Before',
  1800000: '30 Minutes Before',
  3600000: '1 Hour Before',
  86400000: '1 Day Before',
  604800000: '1 Week Before'
}

const getReminderDropdownItems = () => {
  const items = [NONE_OPTION]

  Object.keys(REMINDER_ITEMS).forEach(value => {
    items.push({
      title: REMINDER_ITEMS[value],
      value: Number(value)
    })
  })

  return items
}

export const REMINDER_DROPDOWN_OPTIONS = getReminderDropdownItems()

/**
 *
 * @param {Number} dueDate Timestamp in ms
 * @param {Number} reminderDate Timestamp in ms
 *
 * @return {String} The reminder label
 */
export function getReminderLabel(dueDate, reminderDate) {
  const timeDifference = dueDate - reminderDate

  return REMINDER_ITEMS[timeDifference] || 'None'
}

/**
 *
 * @param {Number} dueDate Timestamp in ms
 * @param {Number} reminderDate Timestamp in ms
 *
 * @return {Object} A title-value object
 */
export function getReminderItem(dueDate, reminderDate) {
  // timeDifference
  const value = dueDate - reminderDate
  const title = REMINDER_ITEMS[value]

  return title
    ? { title, value }
    : { title: fecha.format(reminderDate, 'MMM D, YYYY hh:mm A'), value }
}

/**
 *
 * @param {Number} timeDifference The time difference in ms
 * @param {Date} dueDate The reminder due date-time
 *
 * @return {Date} The reminder date-time
 */

export function getReminder(timeDifference, dueDate = new Date()) {
  const dueDateTimestamp = dueDate.getTime()

  return new Date(dueDateTimestamp - timeDifference)
}
