import Fetch from '../../services/fetch'

/**
 * create a new offer
 */
export async function deleteNotifications(notifications) {
  try {
    await new Fetch().delete('/notifications').send({ notifications })
  } catch (e) {
    throw e
  }
}

export default {
  deleteNotifications
}
