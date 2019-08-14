export function validate(values) {
  const errors = {}

  if (!values.title || !values.title.trim()) {
    errors.title = 'Required!'
  }

  if (values.assignees.length === 0) {
    errors.assignees = 'Each event must have one assignee at least.'
  }

  if (values.associations.length === 0) {
    errors.assignees = 'Each event must have one client at least.'
  }

  return errors
}
