import { getReminderItem } from 'views/utils/reminder'
import { normalizeAssociations } from 'views/utils/association-normalizers'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} owner logged in user
 * @param {object} defaultAssociation The default association(s)
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(task, owner, defaultAssociation) {
  const isAllDayTask = task.metadata?.all_day || false

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
    return {
      assignees: [owner],
      associations,
      dueDate: new Date(),
      endDate: null,
      reminder,
      task_type: { title: 'Call', value: 'Call' }
    }
  }

  const { reminders, end_date } = task

  const normalizeServerDate = (date, isEndDate = false) => {
    const normalizedDate = new Date(Number(date) * 1000)

    if (isAllDayTask) {
      const resetMinutes = isEndDate ? -1 : 0

      normalizedDate.setHours(0, resetMinutes, 0, 0)
    }

    return normalizedDate
  }
  const dueDate = normalizeServerDate(task.due_date)
  const endDate = end_date ? normalizeServerDate(end_date, true) : null

  if (Array.isArray(reminders) && reminders.length > 0) {
    const { timestamp } = reminders[reminders.length - 1]
    const rowReminder = new Date(timestamp * 1000)

    if (isAllDayTask) {
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
    task_type: {
      title: task.task_type,
      value: task.task_type
    }
  }
}
