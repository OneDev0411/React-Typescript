import { byValert } from './get-listings'

export interface GetBrandListingsFilters
  extends Omit<AlertFilters, 'limit' | 'offset'> {
  brand?: UUID
}

export interface GetBrandListingsOptions {
  limit?: number
  offset?: number
  order?: string[]
}

interface GetBrandListingProperties {
  filters?: GetBrandListingsFilters
  options?: GetBrandListingsOptions
}

export async function getBrandListings({
  filters = {
    listing_statuses: ['Active'],
    property_types: ['Residential'],
    property_subtypes: [
      'RES-Single Family',
      'RES-Condo',
      'RES-Townhouse',
      'RES-Half Duplex',
      'RES-Farm/Ranch'
    ]
  },
  options = { order: ['status'] }
}: GetBrandListingProperties): Promise<ICompactListing[]> {
  const { order: sort_order, ...optionProperties } = options

  const response = await byValert(
    {
      ...filters,
      sort_order
    },
    optionProperties,
    false
  )

  return response.data
}
