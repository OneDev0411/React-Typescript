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

  const dueDateTimestamp = dueDate.getTime()

  const task = {
    title: title.trim(),
    due_date: dueDateTimestamp / 1000,
    task_type: task_type.value,
    assignees: assignees.map(a => a.id),
    status:
      dueDateTimestamp <= new Date().getTime() ? 'DONE' : status || 'PENDING'
  }

  if ((originalValues && originalValues.id) || description) {
    task.description = (description && description.trim()) || ''
  }

  if (task.status === 'DONE') {
    task.reminders = []
  } else if (reminder.value >= 0) {
    task.reminders = [
      {
        is_relative: true,
        timestamp: (dueDateTimestamp - reminder.value) / 1000
      }
    ]
  } else if (
    (originalValues && originalValues.reminders == null) ||
    (originalValues && originalValues.reminders && reminder.value == -1)
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
