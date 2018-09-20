export function getReminderValue(reminderLable, dueDate = new Date()) {
  function getReminder(timeDifference) {
    const dueDateTimestamp = dueDate.getTime()

    return new Date(dueDateTimestamp - timeDifference)
  }

  switch (reminderLable) {
    case 'At the time of event':
      return dueDate
    case '5 Minutes Before':
      return getReminder(300000)
    case '15 Minutes Before':
      return getReminder(900000)
    case '30 Minutes Before':
      return getReminder(1800000)
    case '1 Hour Before':
      return getReminder(3600000)
    case '1 Day Before':
      return getReminder(24 * 3600000)
    case '1 Week Before':
      return getReminder(7 * 24 * 3600000)
    default:
      return null
  }
}
