import uniqBy from 'lodash/uniqBy'

import Fetch from '@app/services/fetch'

export async function getDealsListings(
  brandId: UUID,
  dealsLimit: number = 200
): Promise<IListing[]> {
  const response = await new Fetch()
    .get(`/brands/${brandId}/deals`)
    .query({ 'associations[]': 'deal.listing_info' })
    .query({ limit: dealsLimit })

  const dealsWithListings: IDeal<'listing_info'>[] = response.body.data.filter(
    (deal: IDeal<'listing_info'>) => !!deal.listing_info
  )

  const listings = dealsWithListings.map(deal => deal.listing_info)

  return uniqBy(listings, 'id')
}
