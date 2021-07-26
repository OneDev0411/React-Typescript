import Fetch from '../../../services/fetch'

/**
 * Get all of the notifications for the user
 * @returns {object} Returns all of  notifications as 'data' and information about them as 'info'
 */
export async function getAllNotifications() {
  try {
    const response = await new Fetch().get('/notifications')

    return response.body
  } catch (error) {
    throw error
  }
}
