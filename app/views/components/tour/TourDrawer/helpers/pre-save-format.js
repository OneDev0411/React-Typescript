/**
 * Format form data for api model
 * @param {object} values The form values
 * @returns {object} a formated object
 */
export async function preSaveFormat(values, originalValues) {
  const {
    title,
    dueDate,
    reminder,
    description,
    assignees,
    clients = [],
    locations = []
  } = values

  const dueDateTimestamp = dueDate.getTime()
  const isDueDatePast = dueDateTimestamp <= new Date().getTime()

  const task = {
    assignees: assignees.map(a => a.id),
    due_date: dueDateTimestamp / 1000,
    status: isDueDatePast ? 'DONE' : 'PENDING',
    task_type: 'Tour',
    title: title.trim()
  }

  if ((originalValues && originalValues.id) || description) {
    task.description = (description && description.trim()) || ''
  }

  if (isDueDatePast) {
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

  const l = locations.map((location, index) => ({
    ...location,
    index: index + 1
  }))

  task.associations = [...clients, ...l].map(item => {
    const { association_type } = item
    const association = {
      association_type,
      [association_type]: item[association_type].id
    }

    if (item.id) {
      association.id = item.id
    }

    if (item.index) {
      association.index = item.index
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
