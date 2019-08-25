export function validate(values) {
  const errors = {}

  if (!values.title || !values.title.trim()) {
    errors.title = 'Required!'
  }

  if (values.assignees.length === 0) {
    errors.assignees = 'Each event must have at least one assignee.'
  }

  if (!values.associations.some(item => item.association_type === 'contact')) {
    errors.associations = 'Each event must have at least one attached contact.'
  }

  return errors
}
