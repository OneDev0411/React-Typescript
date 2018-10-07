import { getReminderValue } from '../../../EventDrawer/helpers/get-reminder-value'

/**
 * Format form data for api model
 * @param {object} values The form values
 * @returns {object} a formated object
 */
export async function preSaveFormat(values, originalValues, deal) {
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

  const due_date = dueDate.getTime() / 1000
  const task_type = 'Open House'

  const task = {
    title,
    due_date,
    task_type,
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
        is_relative: true,
        timestamp: reminderDate.getTime() / 1000
      }
    ]
  } else if (
    (originalValues && originalValues.reminders == null) ||
    (originalValues && originalValues.reminders && reminderDate == null)
  ) {
    task.reminders = []
  }

  let associations = []

  if (!originalValues && deal) {
    associations.push({
      association_type: 'deal',
      deal: deal.id
    })
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
