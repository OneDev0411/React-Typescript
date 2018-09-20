import { getTaskAssociations } from '../../../../models/tasks/get-task-associations'
import { normalizeAssociations } from '../../../utils/association-normalizers'

/**
 * Fetch and normalize task assosiations
 * @param {UUID} taskId The task id
 * @returns {array} a normalized array of associations
 */
export async function getAssociations(task) {
  try {
    let query = []
    const types = ['deal', 'contact', 'listing']
    const queryName = 'associations[]=crm_association.'

    types.forEach(type => {
      const value = task[`${type}s`]

      if (value && value.length > 0) {
        query.push(`${queryName}${type}`)

        if (type === 'contact') {
          query.push('associations[]=contact.summary')
        }
      }
    })

    if (query.length > 0) {
      const records = await getTaskAssociations(task.id, query.join('&'))

      return normalizeAssociations(records)
    }

    return query
  } catch (error) {
    throw error
  }
}
