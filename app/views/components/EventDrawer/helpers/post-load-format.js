import { getReminderItem } from 'views/utils/reminder'
import { normalizeAssociations } from 'views/utils/association-normalizers'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} owner logged in user
 * @param {object} defaultAssociation The default association(s)
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(
  task,
  owner,
  defaultAssociation,
  defaultSelectedDate = new Date()
) {
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
      dueDate: new Date(defaultSelectedDate),
      reminder,
      task_type: { title: 'Call', value: 'Call' }
    }
  }

  const { reminders, due_date } = task
  const dueDate = due_date * 1000

  if (Array.isArray(reminders) && reminders.length > 0) {
    const { timestamp } = reminders[reminders.length - 1]

    if (timestamp && timestamp * 1000 > new Date().getTime()) {
      reminder = getReminderItem(dueDate, timestamp * 1000)
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
    task_type: {
      title: task.task_type,
      value: task.task_type
    },
    reminder,
    dueDate: new Date(dueDate)
  }
}
