import { createTask } from 'models/tasks/create-task'

/**
 * Add a CRM log as an event.
 * @param {assignee} userId A Rechat user id.
 * @param {String} title The log title.
 * @param {Array} associations Array of the Rechat CRM event associations.
 */
export function addCRMLog(assignee, title, associations) {
  const log = {
    title,
    due_date: new Date().getTime() / 1000,
    task_type: 'Email',
    status: 'DONE',
    assignees: [assignee],
    associations
  }

  createTask(log)
}
