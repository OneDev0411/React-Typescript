import { getAssociations } from './get-associations'
import { getReminderLabel } from './get-reminder-label'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} defaultAssociation The default association
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(task, defaultAssociation) {
  const REMINDER_DEFAULT_LABEL = '15 Minutes Before'

  let reminder = {
    title: REMINDER_DEFAULT_LABEL,
    value: REMINDER_DEFAULT_LABEL
  }

  let associations = []

  if (defaultAssociation) {
    associations.push(defaultAssociation)
  }

  if (!task) {
    return {
      reminder,
      associations,
      dueDate: new Date(),
      task_type: { title: 'Call', value: 'Call' }
    }
  }

  const { reminders, due_date } = task
  const dueDate = due_date * 1000

  if (
    Array.isArray(reminders) &&
    reminders.length > 0 &&
    reminders[reminders.length - 1].timestamp
  ) {
    const { timestamp } = reminders[reminders.length - 1]

    const title = getReminderLabel(dueDate, timestamp * 1000)

    reminder = { title, value: title }
  }

  associations = await getAssociations(task)

  return {
    ...task,
    task_type: {
      title: task.task_type,
      value: task.task_type
    },
    reminder,
    dueDate: new Date(dueDate),
    associations
  }
}
