export const REMINDER_ITEMS = [
  { title: 'None', value: null },
  { title: 'At the time of event', value: 0 },
  { title: '5 Minutes Before', value: 300000 },
  { title: '15 Minutes Before', value: 900000 },
  { title: '30 Minutes Before', value: 1800000 },
  { title: '1 Hour Before', value: 3600000 },
  { title: '1 Day Before', value: 86400000 },
  { title: '1 Week Before', value: 604800000 }
]

/**
 *
 * @param {Number} dueDate Timestamp
 * @param {Number} reminderDate Timestamp
 *
 * @return {String} The reminder label
 */
export function getReminderLabel(dueDate, reminderDate) {
  const timeDifference = dueDate - reminderDate

  switch (timeDifference) {
    case 0:
      return 'At the time of event'
    case 300000:
      return '5 Minutes Before'
    case 900000:
      return '15 Minutes Before'
    case 1800000:
      return '30 Minutes Before'
    case 3600000:
      return '1 Hour Before'
    case 24 * 3600000:
      return '1 Day Before'
    case 7 * 24 * 3600000:
      return '1 Week Before'
    default:
      return 'None'
  }
}
