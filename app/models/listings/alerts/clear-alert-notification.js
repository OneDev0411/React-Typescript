import Fetch from '../../../services/fetch'

const clearAlertNotification = async (alertId, roomId) => {
  try {
    const response = await new Fetch()
      .delete(`/rooms/${roomId}/recs/feed`)
      .query({ filter: alertId })

    return response.body.code
  } catch (error) {
    throw error
  }
}

export default clearAlertNotification
