import Fetch from '../../../services/fetch'

const changeAlertFollowStatus = async (id, status) => {
  try {
    const response = await new Fetch()
      .patch(`/alerts/${id}/status`)
      .send({ status })

    return response
  } catch (error) {
    throw error
  }
}

export default changeAlertFollowStatus
