/**
 * Format form data for api model
 * @param {object} owner the logged in user object
 * @param {object} defaultAssociation The default association
 * @returns {object} a formated Task
 */
export async function postLoadFormat(owner, defaultAssociation) {
  const REMINDER_DEFAULT_LABEL = '15 Minutes Before'

  return {
    assignees: [owner],
    associations: defaultAssociation ? [defaultAssociation] : [],
    dueDate: new Date(),
    reminder: {
      title: REMINDER_DEFAULT_LABEL,
      value: REMINDER_DEFAULT_LABEL
    },
    task_type: { title: 'Call', value: 'Call' }
  }
}
