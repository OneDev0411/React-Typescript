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
