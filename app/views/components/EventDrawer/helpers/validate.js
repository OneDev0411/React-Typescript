export function validate(values) {
  const errors = {}

  if (!values.title || !values.title.trim()) {
    errors.title = 'Required!'
  }

  if (values.endDate && values.endDate.getTime() < values.dueDate.getTime()) {
    errors.endDate = 'The End time should always be after start time!'
  }

  if (values.assignees.length === 0) {
    errors.assignees = 'Each event must have at least one assignee.'
  }

  if (values.associations.length === 0) {
    errors.associations = 'Each event must have at least one attachment.'
  }

  return errors
}
