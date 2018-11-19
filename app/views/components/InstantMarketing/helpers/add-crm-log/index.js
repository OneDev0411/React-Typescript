import { createTask } from 'models/tasks/create-task'

/**
 * Add a CRM log as an event.
 * @param {String} title The log title.
 * @param {Array} associations Array of the Rechat CRM contact ids.
 */
export function addCRMLog(title, associations, userId) {
  const log = {
    title,
    due_date: new Date().getTime() / 1000,
    task_type: 'Email',
    status: 'DONE',
    assignees: [userId],
    associations: associations.map(id => ({
      contact: id,
      association_type: 'contact'
    }))
  }

  createTask(log)
}
