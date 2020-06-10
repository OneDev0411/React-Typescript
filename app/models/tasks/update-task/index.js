import _ from 'underscore'

import Fetch from '../../../services/fetch'

/**
 * Update a task.
 * @param {object} task The task.
 * @param {object|string} query The request query strings.
 * @returns {object} Returns updated task.
 */
export async function updateTask(task, query = {}) {
  if (!task || !task.id) {
    throw new Error('Task id is required.')
  }

  try {
    const fields = [
      'id',
      'type',
      'index',
      'title',
      'status',
      'all_day',
      'due_date',
      'end_date',
      'task_type',
      'reminders',
      'assignees',
      'description',
      'metadata',
      'associations'
    ]

    task = _.omit(_.pick(task, fields), value => value == null)

    if (task.assignees && task.assignees.length > 0 && task.assignees[0].id) {
      task = {
        ...task,
        assignees: task.assignees.map(a => a.id)
      }
    }

    const response = await new Fetch()
      .put(`/crm/tasks/${task.id}`)
      .query(query)
      .send(task)

    return response.body.data
  } catch (error) {
    throw error
  }
}
