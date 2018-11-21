export function validate(values) {
  const errors = {}

  if (!values.title) {
    errors.title = 'Required!'
  }

  if (values.assignees.length === 0) {
    errors.assignees = 'Each event must have at least one assignee.'
  }

  return errors
}
