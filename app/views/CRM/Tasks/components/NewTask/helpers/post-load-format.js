/**
 * Format form data for api model
 * @param {object} owner the logged in user object
 * @param {object} defaultAssociation The default association
 * @returns {object} a formated Task
 */
export async function postLoadFormat(owner, defaultAssociation) {
  return {
    assignees: [owner],
    associations: defaultAssociation ? [defaultAssociation] : [],
    dueDate: new Date(),
    reminder: {
      title: 'None',
      value: null
    },
    task_type: { title: 'Call', value: 'Call' }
  }
}
