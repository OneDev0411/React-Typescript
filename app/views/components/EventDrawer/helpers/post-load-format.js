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

  const normalizeServerDate = date => date * 1000
  const dueDate = normalizeServerDate(task.due_date)
  const endDate = end_date ? new Date(normalizeServerDate(end_date)) : null

  if (Array.isArray(reminders) && reminders.length > 0) {
    const { timestamp } = reminders[reminders.length - 1]
    const reminderTimestamp = timestamp * 1000

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
    dueDate: new Date(dueDate),
    endDate,
    task_type: {
      title: task.task_type,
      value: task.task_type
    }
  }
}
