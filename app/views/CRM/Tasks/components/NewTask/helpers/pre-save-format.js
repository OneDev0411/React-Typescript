import { setTime } from '../../../../../../utils/set-time'

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
    dueTime,
    task_type,
    description,
    reminderDate,
    reminderTime,
    associations
  } = values

  const due_date = setTime(dueDate.value, dueTime.value) / 1000

  const task = {
    title,
    due_date,
    task_type: task_type.value
  }

  if (originalValues && originalValues.id && status) {
    task.status = status
  }

  if ((originalValues && originalValues.id) || description) {
    task.description = description || ''
  }

  if (reminderDate.value && reminderTime.value != null) {
    const reminders = originalValues && originalValues.reminders
    let reminder = {
      is_relative: false,
      timestamp: setTime(reminderDate.value, reminderTime.value) / 1000
    }

    if (reminders) {
      reminder = {
        ...reminder,
        id: reminders[0].id
      }
    }

    task.reminders = [reminder]
  } else if (
    (originalValues && originalValues.reminders == null) ||
    (originalValues && originalValues.reminders && reminderDate.value == null)
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
