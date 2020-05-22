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
    endDate,
    reminder,
    task_type,
    description,
    assignees,
    associations = []
  } = values
  // const isAllDay = values.metadata?.all_day || false

  // if (isAllDay) {
  //   dueDate.setUTCHours(24, 0, 0, 0)
  //   endDate.setUTCHours(24, 0, 0, 0)
  // }

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

  if (endDate) {
    task.end_date = endDate.getTime() / 1000
  } else if (originalValues && originalValues.end_date) {
    task.end_date = null
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

  task.associations = associations.map(item => {
    const { association_type } = item
    const association = {
      association_type,
      [association_type]: item[association_type].id
    }

    if (item.id) {
      association.id = item.id
    }

    return association
  })

  if (originalValues) {
    return {
      ...originalValues,
      ...task
    }
  }

  return task
}
