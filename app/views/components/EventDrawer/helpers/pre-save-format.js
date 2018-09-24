import { getReminderValue } from './get-reminder-value'

/**
 * Format form data for api model
 * @param {object} values The form values
 * @returns {object} a formated object
 */
export async function preSaveFormat(values, originalValues) {
  const {
    title,
    status,
    dueDate,
    reminder,
    task_type,
    description,
    assignees,
    associations
  } = values

  // console.log('pre save', values.dueDate, values.reminder.value)

  const due_date = dueDate.getTime() / 1000

  const task = {
    title,
    due_date,
    task_type: task_type.value,
    assignees: assignees.map(a => a.id)
  }

  if (originalValues && originalValues.id && status) {
    task.status = status
  }

  if ((originalValues && originalValues.id) || description) {
    task.description = description || ''
  }

  const reminderDate = getReminderValue(reminder.value, dueDate)

  if (
    reminderDate != null &&
    dueDate.getTime() >= new Date().getTime() + 1800000
  ) {
    task.reminders = [
      {
        is_relative: false,
        timestamp: reminderDate.getTime() / 1000
      }
    ]
  } else if (
    (originalValues && originalValues.reminders == null) ||
    (originalValues && originalValues.reminders && reminderDate == null)
  ) {
    task.reminders = []
  }

  if (
    !originalValues &&
    Array.isArray(associations) &&
    associations.length > 0
  ) {
    task.associations = []
    associations.forEach(item => {
      const { association_type } = item

      if (association_type) {
        task.associations.push({
          association_type,
          [association_type]: item[association_type].id
        })
      }
    })
  }

  if (originalValues) {
    return {
      ...originalValues,
      ...task
    }
  }

  return task
}
