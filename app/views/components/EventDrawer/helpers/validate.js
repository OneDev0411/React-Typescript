const endDateValidator = (dueDate, endDate, isAllDay) => {
  if (!endDate) {
    return true
  }

  if (isAllDay) {
    return (
      endDate.getFullYear() < dueDate.getFullYear() ||
      endDate.getMonth() < dueDate.getMonth() ||
      endDate.getDate() < dueDate.getDate()
    )
  }

  return endDate.getTime() < dueDate.getTime()
}

export const validate = values => {
  const { title, dueDate, endDate, allDay, assignees } = values
  const errors = {}

  if (!title || !title.trim()) {
    errors.title = 'Required!'
  }

  if (endDate && endDateValidator(dueDate, endDate, allDay)) {
    errors.endDate = 'End time must be after the start time!'
  }

  if (assignees.length === 0) {
    errors.assignees = 'Each event must have at least one assignee.'
  }

  return errors
}
