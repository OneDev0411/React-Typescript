import Fetch from '../../../services/fetch'

const getListing = async id => {
  if (!id) {
    return
  }

  try {
    const response = await new Fetch().get(
      `/listings/${id}/?associations=listing.proposed_agent`
    )

    return response.body.data
  } catch (error) {
    throw error
  }
}

export default getListing
