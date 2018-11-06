import { getReminderItem } from 'views/utils/reminder'

import { getAssociations } from './get-associations'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} owner logged in user
 * @param {object} defaultAssociation The default association
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(task, owner, defaultAssociation) {
  let reminder = {
    title: 'None',
    value: null
  }

  if (!task) {
    return {
      assignees: [owner],
      associations: defaultAssociation ? [defaultAssociation] : [],
      dueDate: new Date(),
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

  task.associations = await getAssociations(task)

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
