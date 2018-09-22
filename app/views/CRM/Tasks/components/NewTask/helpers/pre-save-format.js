// import { setTime } from '../../../../../../utils/set-time'
import { getReminderValue } from './get-reminder-value'

/**
 * Format form data for api Event model
 * @param {object} values The form values
 * @returns {object} a formated event object
 */
export async function preSaveFormat(values) {
  const {
    title,
    dueDate,
    reminder,
    task_type,
    assignees,
    associations
  } = values

  const due_date = dueDate.getTime() / 1000

  const event = {
    title,
    due_date,
    task_type: task_type.value,
    assignees: assignees.map(a => a.id)
  }

  if (dueDate.getTime() > new Date().getTime()) {
    const reminderDate = getReminderValue(reminder.value, dueDate)

    if (reminderDate != null) {
      event.reminders = [
        {
          is_relative: true,
          timestamp: reminderDate.getTime() / 1000
        }
      ]
    }
  }

  if (Array.isArray(associations) && associations.length > 0) {
    event.associations = []
    associations.forEach(item => {
      const { association_type } = item

      if (association_type) {
        event.associations.push({
          association_type,
          [association_type]: item[association_type].id
        })
      }
    })
  }

  return event
}
