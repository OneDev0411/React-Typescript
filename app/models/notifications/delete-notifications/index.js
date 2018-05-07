import Fetch from '../../../services/fetch'

/**
 * Delete new notifications.
 * @returns {object} Returns response - actually nothing. it returns 204.
 */

export async function deleteNewNotifications() {
  try {
    return await new Fetch().delete('/notifications')
  } catch (error) {
    throw error
  }
}
