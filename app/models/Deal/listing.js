import Fetch from '../../services/fetch'

/**
 * update listing
 */
export async function updateListing(dealId, listingId) {
  try {
    const response = await new Fetch()
      .patch(`/deals/${dealId}/listing`)
      .send({ listing: listingId })

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default {
  updateListing
}
