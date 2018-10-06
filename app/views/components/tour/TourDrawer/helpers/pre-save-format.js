import { getReminderValue } from '../../../EventDrawer/helpers/get-reminder-value'

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
    description,
    assignees,
    clients,
    locations
  } = values

  // console.log('pre save', values.dueDate, values.reminder.value)

  const due_date = dueDate.getTime() / 1000

  const task = {
    title,
    due_date,
    task_type: 'tour',
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

  let associations = []

  const addAssociation = (association, type) => {
    const { association_type } = association

    if (association_type && association_type === type) {
      associations.push({
        association_type,
        [association_type]: association[association_type].id
      })
    }
  }

  if (!originalValues && Array.isArray(locations) && locations.length > 0) {
    locations.forEach(l => addAssociation(l, 'listing'))
  }

  if (!originalValues && Array.isArray(clients) && clients.length > 0) {
    clients.forEach(c => addAssociation(c, 'contact'))
  }

  if (associations.length > 0) {
    task.associations = associations
  }

  if (originalValues) {
    return {
      ...originalValues,
      ...task
    }
  }

  return task
}
