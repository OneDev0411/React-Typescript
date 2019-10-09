export function validate(values) {
  const errors = {}

  if (!values.title || !values.title.trim()) {
    errors.title = 'Required!'
  }

  if (values.assignees.length === 0) {
    errors.assignees = 'Each event must have at least one assignee.'
  }

  if (values.locations.length === 0) {
    errors.locations = 'Each event must have at least one location.'
  }

  return errors
}
