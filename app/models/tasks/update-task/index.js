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
      'title',
      'status',
      'due_date',
      'task_type',
      'reminders',
      'assignees',
      'description'
    ]

    task = _.omit(_.pick(task, fields), value => value == null)

    const response = await new Fetch()
      .put(`/crm/tasks/${task.id}`)
      .query(query)
      .send(task)

    return response.body.data
  } catch (error) {
    throw error
  }
}
