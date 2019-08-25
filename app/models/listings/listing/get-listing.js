import Fetch from '../../../services/fetch'

const getListing = async (listingId, brandId) => {
  if (!listingId) {
    return
  }

  try {
    const req = new Fetch().get(`/listings/${listingId}/`).query({
      associations: 'listing.proposed_agent'
    })

    if (brandId) {
      req.set('X-RECHAT-BRAND', brandId)
    }

    const response = await req

    return response.body.data
  } catch (err) {
    throw err
  }
}

export default getListing
