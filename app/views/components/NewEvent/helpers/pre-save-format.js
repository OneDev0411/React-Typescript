/**
 * Format form data for api Event model
 * @param {object} values The form values
 * @returns {object} a formated crm_event object
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

  const dueDateTimestamp = dueDate.getTime()

  const crm_event = {
    assignees: assignees.map(a => a.id),
    due_date: dueDateTimestamp / 1000,
    status: 'DONE',
    task_type: task_type.value,
    title: title.trim()
  }

  if (
    reminder.value != null &&
    dueDateTimestamp >= dueDateTimestamp - reminder.value
  ) {
    crm_event.reminders = [
      {
        is_relative: true,
        timestamp: (dueDateTimestamp - reminder.value) / 1000
      }
    ]

    crm_event.status = 'PENDING'
  }

  if (Array.isArray(associations) && associations.length > 0) {
    crm_event.associations = []
    associations.forEach(item => {
      const { association_type } = item

      if (association_type) {
        crm_event.associations.push({
          association_type,
          [association_type]: item[association_type].id
        })
      }
    })
  }

  return crm_event
}
