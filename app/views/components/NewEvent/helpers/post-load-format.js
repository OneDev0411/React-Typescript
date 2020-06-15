import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'

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
    reminder: REMINDER_DROPDOWN_OPTIONS[3], // 15 minutes before
    task_type: { title: 'Call', value: 'Call' }
  }
}
