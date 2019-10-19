export function validate(values) {
  const errors = {}

  if (!values.title || !values.title.trim()) {
    errors.title = 'Required!'
  }

  if (values.endDate && values.endDate.getTime() <= values.dueDate.getTime()) {
    errors.endDate = 'End time must be after the start time!'
  }

  if (values.assignees.length === 0) {
    errors.assignees = 'Each event must have at least one assignee.'
  }

  return errors
}
