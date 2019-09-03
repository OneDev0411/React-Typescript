/**
 * Format form data for api model
 * @param {object} values The form values
 * @returns {object} a formated object
 */
export async function preSaveFormat(
  values,
  originalValues,
  template,
  dealAssociation
) {
  const {
    assignees,
    description,
    dueDate,
    location,
    registrants,
    reminder,
    status,
    title
  } = values

  // console.log('pre save', values.dueDate, values.reminder.value)

  const dueDateTimestamp = dueDate.getTime()
  const task_type = 'Open House'

  const task = {
    title: title.trim(),
    due_date: dueDateTimestamp / 1000,
    task_type,
    metadata: { template },
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

  let associations = []

  if (!originalValues && dealAssociation) {
    associations.push(dealAssociation)
  }

  const addAssociation = (association, type) => {
    const { association_type } = association

    if (association_type && association_type === type) {
      associations.push({
        association_type,
        [association_type]: association[association_type].id
      })
    }
  }

  if (location) {
    addAssociation(location, 'listing')
  }

  if (!originalValues && Array.isArray(registrants) && registrants.length > 0) {
    registrants.forEach(c => addAssociation(c, 'contact'))
  }

  if (associations.length > 0) {
    task.associations = associations
  }

  if (originalValues) {
    return {
      ...originalValues,
      ...task,
      task_type // todo: removing this and line 23
    }
  }

  return task
}
