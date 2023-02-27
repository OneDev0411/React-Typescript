import uniqBy from 'lodash/uniqBy'

import Fetch from '@app/services/fetch'

export interface GetDealsListingFilters {
  brand: UUID
  status?: {
    is_active?: boolean
    is_pending?: boolean
    is_archived?: boolean
    is_closed?: boolean
    is_null?: boolean
  }
  search?: Nullable<string>
}

export interface GetDealsListingOptions {
  limit?: number
  offset?: number
}

interface GetDealsListingProperties {
  filters: GetDealsListingFilters
  options?: GetDealsListingOptions
}

const buildPostParameters = <T extends {}>(parameters: T) =>
  Object.keys(parameters)
    .filter(key => Boolean(parameters[key]))
    .reduce((previous, key) => ({ ...previous, [key]: parameters[key] }), {})

export async function getDealsListings({
  options = { limit: 200 },
  filters: { search: query, ...filters }
}: GetDealsListingProperties): Promise<{
  count: number
  listings: IListing[]
}> {
  const { body } = await new Fetch()
    .post('/deals/filter')
    .query({ 'associations[]': 'deal.listing_info' })
    .send(
      buildPostParameters({
        ...filters,
        query,
        limit: options?.limit,
        start: options?.offset
      })
    )

  const dealsWithListings: IDeal<'listing_info'>[] = body.data.filter(
    (deal: IDeal<'listing_info'>) => !!deal.listing_info
  )

  const listings = dealsWithListings.map(deal => deal.listing_info)

  return {
    count: body.info.total,
    listings: uniqBy(listings, 'id')
  }
}
