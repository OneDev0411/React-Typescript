import Fetch from '../../../services/fetch'

export default async function getListing(
  listingId: UUID,
  brandId?: UUID
): Promise<IListing<'proposed_agent' | 'mls_info'>> {
  try {
    const req = new Fetch().get(`/listings/${listingId}/`).query({
      'associations[]': [
        'listing.proposed_agent',
        'listing.mls_info',
        'agent.office'
      ]
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
