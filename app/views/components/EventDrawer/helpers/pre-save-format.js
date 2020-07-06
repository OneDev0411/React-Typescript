import { stateToHTML } from 'draft-js-export-html'

/**
 * Format form data for api model
 * @param {object} values The form values
 * @returns {object} a formated object
 */
export async function preSaveFormat(values, originalValues = null) {
  const {
    title,
    dueDate,
    endDate,
    allDay,
    reminder,
    task_type,
    description,
    assignees,
    associations = []
  } = values

  const isAllDay = allDay || false

  if (isAllDay) {
    dueDate.setUTCFullYear(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    )
    dueDate.setUTCHours(0, 0, 0, 0)

    endDate.setUTCFullYear(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    )
    endDate.setUTCHours(24, 0, 0, 0)
  }

  const dueDateTimestamp = dueDate.getTime()
  const endDateTimestamp = endDate.getTime()
  const end_date =
    originalValues?.end_date || endDateTimestamp > dueDateTimestamp
      ? endDateTimestamp / 1000
      : null

  const task = {
    title: title.trim(),
    due_date: dueDateTimestamp / 1000,
    end_date,
    task_type: task_type.value,
    all_day: isAllDay,
    assignees: assignees.map(a => a.id),
    status: dueDateTimestamp <= new Date().getTime() ? 'DONE' : 'PENDING'
  }

  if (originalValues?.id || description) {
    const currentDescription = description.getCurrentContent()

    task.description =
      currentDescription.hasText() &&
      currentDescription.getPlainText().trim().length > 0
        ? stateToHTML(currentDescription)
            .trim()
            .replace(/(\r\n|\n|\r)/gm, '') // remove unneccessary new line
        : ''
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
    originalValues?.reminders == null ||
    (originalValues?.reminders && reminder.value == -1)
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
