import { getMembers } from '../../TeamContact/helpers'

/**
 * Fetch and normalize task assosiations
 * @param {UUID} taskId The task id
 * @returns {array} a normalized array of associations
 */
export async function getAssignees(assigneesIds, user) {
  try {
    const members = await getMembers(user)

    return members.filter(m => assigneesIds.some(id => id === m.id))
  } catch (error) {
    console.log(error)
    throw error
  }
}
