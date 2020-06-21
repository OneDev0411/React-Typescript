export function validate(values) {
  const { title, endDate, dueDate, allDay, assignees } = values
  const errors = {}
  const endDateValidator = allDay
    ? endDate.getFullYear() < dueDate.getFullYear() ||
      endDate.getMonth() < dueDate.getMonth() ||
      endDate.getDate() < dueDate.getDate()
    : endDate.getTime() < dueDate.getTime()

  if (!title || !title.trim()) {
    errors.title = 'Required!'
  }

  if (endDate && endDateValidator) {
    errors.endDate = 'End time must be after the start time!'
  }

  if (assignees.length === 0) {
    errors.assignees = 'Each event must have at least one assignee.'
  }

  return errors
}
