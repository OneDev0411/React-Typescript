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
export function hasValidConnectedAccount(accounts) {
  if (!Array.isArray(accounts)) {
    return false
  }

  const filteredGoogle = accounts.filter(account => {
    if (!Array.isArray(account.scope_summary)) {
      return false
    }

    return (
      account.type === 'google_credential' &&
      !account.revoked &&
      !account.deleted_at &&
      account.scope_summary.includes('calendar')
    )
  })

  return filteredGoogle.length > 0
}

export function hasContactAssociation(event) {
  if (!event || !event.associations) {
    return false
  }

  const contactAssociationsCount = event.associations.filter(
    i => i.association_type === 'contact'
  ).length

  return contactAssociationsCount > 0
}
