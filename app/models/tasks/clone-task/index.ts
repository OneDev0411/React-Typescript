import Fetch from '../../../services/fetch'

/**
 * Create a new task.
 * @param {UUID} id The existing task id.
 * @param {object} task The new new task data.
 * @param {object|string} query The request query strings.
 * @returns {object} Returns new task which is clone from another.
 */

export async function cloneTask(
  id: UUID,
  task,
  query = {}
): Promise<ICalendarEvent> {
  try {
    const response = await new Fetch()
      .post(`/crm/tasks/${id}/clone`)
      .send(task)
      .query(query)
      .query({
        associations: ['crm_task.associations', 'crm_association.contact']
      })

    return response.body.data
  } catch (error) {
    throw error
  }
}
