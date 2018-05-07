import Fetch from '../../../services/fetch'

/**
 * Mark all notifications as seen
 * @returns {object} Returns response - actually nothing. it returns 204
 */
export async function markAllNotificationsAsSeen() {
  try {
    return await new Fetch().patch('/notifications/seen')
  } catch (error) {
    throw error
  }
}
