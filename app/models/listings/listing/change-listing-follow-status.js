import Fetch from '../../../services/fetch'

const changeAlertFollowStatuses = async (id, statuses) => {
  try {
    const response = await new Fetch()
      .patch(`/listings/${id}/status/`)
      .send({ status: statuses })

    return response
  } catch (error) {
    throw error
  }
}

export default changeAlertFollowStatuses
