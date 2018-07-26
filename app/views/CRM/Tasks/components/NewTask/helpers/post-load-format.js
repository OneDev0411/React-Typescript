import { defaultTimeOption } from '../../../../../../utils/default-time-option'

import { getAssociations } from './get-associations'
import { createDateOptions } from './create-date-options'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} defaultAssociation The default association
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(task, defaultAssociation) {
  const today = new Date().getTime()
  const tomorrow = today + 24 * 60 * 60 * 1000

  let dueDate = createDateOptions(today, tomorrow, 'due-date')
  let dueTime = defaultTimeOption(null, '08:00 AM')
  let reminderDate = {
    title: 'No reminder',
    value: null
  }
  let reminderTime = defaultTimeOption()
  let task_type = { title: 'Todo', value: 'Todo' }
  let associations = []

  if (defaultAssociation) {
    associations.push(defaultAssociation)
  }

  if (!task) {
    return {
      dueDate,
      dueTime,
      task_type,
      reminderDate,
      reminderTime,
      associations
    }
  }

  const { due_date, reminders, task_type: type } = task

  if (type) {
    task_type = {
      title: type,
      value: type
    }
  }

  if (due_date) {
    dueDate = createDateOptions(today, due_date * 1000, 'due-date')
    dueTime = defaultTimeOption(due_date * 1000)
  }

  if (
    Array.isArray(reminders) &&
    reminders.length > 0 &&
    reminders[reminders.length - 1].timestamp
  ) {
    const { timestamp } = reminders[reminders.length - 1]

    reminderDate = createDateOptions(
      due_date * 1000,
      timestamp * 1000,
      'reminder'
    )
    reminderTime = defaultTimeOption(timestamp * 1000)
  }

  associations = await getAssociations(task)

  return {
    ...task,
    dueDate,
    dueTime,
    task_type,
    reminderDate,
    reminderTime,
    associations
  }
}
