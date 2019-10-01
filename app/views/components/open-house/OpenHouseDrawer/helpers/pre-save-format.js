/**
 * Format form data for api model
 * @param {object} values The form values
 * @returns {object} a formated object
 */
export async function preSaveFormat(
  values,
  originalValues,
  template,
  dealAssociation = {}
) {
  const {
    assignees,
    description,
    dueDate,
    location = {},
    registrants = [],
    reminder,
    title
  } = values

  const dueDateTimestamp = dueDate.getTime()
  const isDueDatePast = dueDateTimestamp <= new Date().getTime()

  const task = {
    assignees: assignees.map(a => a.id),
    due_date: dueDateTimestamp / 1000,
    metadata: { template },
    status: isDueDatePast ? 'DONE' : 'PENDING',
    title: title.trim(),
    task_type: 'Open House'
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

  task.associations = [...registrants, location, dealAssociation].map(item => {
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
