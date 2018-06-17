import Fetch from '../../../services/fetch'

const changeAlertFollowStatuses = async (id, statuses) => {
  try {
    const response = await new Fetch()
      .patch(`/listings/${id}/status/?associations=listing.proposed_agent`)
      .send({ status: statuses })

    return response
  } catch (error) {
    throw error
  }
}

export default changeAlertFollowStatuses
