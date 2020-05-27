import { isNegativeTimezone } from 'utils/is-negative-timezone'

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
    allDay,
    reminder,
    task_type,
    description,
    assignees,
    associations = []
  } = values
  const isAllDay = values.metadata?.all_day || allDay || false

  if (isAllDay) {
    const resetHours = isNegativeTimezone() ? 0 : 24

    dueDate.setUTCHours(resetHours, 0, 0, 0)
    endDate.setUTCHours(resetHours, 0, 0, 0)
  }

  const dueDateTimestamp = dueDate.getTime()
  const endDateTimestamp = endDate.getTime()

  const task = {
    title: title.trim(),
    due_date: dueDateTimestamp / 1000,
    end_date: endDateTimestamp / 1000,
    task_type: task_type.value,
    metadata: {
      all_day: !!allDay
    },
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
    const metadata = originalValues.metadata
      ? { ...originalValues.metadata, ...task.metadata }
      : task.metadata

    return {
      ...originalValues,
      ...task,
      metadata
    }
  }

  return task
}
