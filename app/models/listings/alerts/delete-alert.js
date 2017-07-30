import Fetch from '../../../services/fetch'

const deleteAlert = async (alertId, roomId) => {
  try {
    return new Fetch().delete(`/rooms/${roomId}/alerts/${alertId}`)
  } catch (error) {
    throw error
  }
}

export default deleteAlert
