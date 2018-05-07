import Fetch from '../../../services/fetch'

/**
 * Mark a notification as seen
 * @param {UUID} notificationId The notification id.
 * @returns {object} Returns response - actually nothing. it returns 204
 */
export async function markNotificationAsSeen(notificationId) {
  try {
    return await new Fetch().patch(`/notifications/${notificationId}/seen`)
  } catch (error) {
    throw error
  }
}
