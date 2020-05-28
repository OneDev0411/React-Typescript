import { getReminderItem } from 'views/utils/reminder'
import { normalizeAssociations } from 'views/utils/association-normalizers'
import { isNegativeTimezone } from 'utils/is-negative-timezone'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} owner logged in user
 * @param {object} defaultAssociation The default association(s)
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(task, owner, defaultAssociation) {
  let reminder = {
    title: 'None',
    value: -1
  }

  const associations = []

  if (defaultAssociation) {
    if (Array.isArray(defaultAssociation)) {
      associations.push(...defaultAssociation)
    } else {
      associations.push(defaultAssociation)
    }
  }

  if (!task) {
    const initialDueDate = new Date()
    const initialEndDate = new Date()

    initialDueDate.setHours(0, 0, 0, 0)
    initialEndDate.setHours(23, 59, 0, 0)

    return {
      assignees: [owner],
      associations,
      dueDate: initialDueDate,
      endDate: initialEndDate,
      allDay: true,
      reminder,
      task_type: { title: 'Call', value: 'Call' }
    }
  }

  const { reminders, end_date } = task
  const isAllDayTask = task.metadata?.all_day || false

  const normalizeServerDate = (date, isEndDate = false) => {
    const normalizedDate = new Date(Number(date) * 1000)

    if (isAllDayTask) {
      const resetHours = isNegativeTimezone() ? 24 : 0
      const resetMinutes = isEndDate ? -1 : 0

      normalizedDate.setHours(resetHours, resetMinutes, 0, 0)
    }

    return normalizedDate
  }
  const dueDate = normalizeServerDate(task.due_date)
  const endDate = end_date ? normalizeServerDate(end_date, true) : null

  if (Array.isArray(reminders) && reminders.length > 0) {
    const { timestamp } = reminders[reminders.length - 1]
    const rowReminder = new Date(timestamp * 1000)

    if (isAllDayTask) {
      rowReminder.setDate(rowReminder.getUTCDate())
      rowReminder.setMonth(rowReminder.getUTCMonth())
      rowReminder.setHours(
        rowReminder.getUTCHours(),
        rowReminder.getUTCMinutes(),
        0,
        0
      )
    }

    const reminderTimestamp = rowReminder.getTime()

    if (timestamp && reminderTimestamp > new Date().getTime()) {
      reminder = getReminderItem(dueDate, reminderTimestamp)
    }
  }

  if (task.assignees == null) {
    task.assignees = []
  }

  if (Array.isArray(task.associations)) {
    task.associations = normalizeAssociations(task.associations)
  } else {
    task.associations = []
  }

  return {
    ...task,
    reminder,
    dueDate,
    endDate,
    allDay: isAllDayTask,
    task_type: {
      title: task.task_type,
      value: task.task_type
    }
  }
}
