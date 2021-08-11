import { byValert } from './get-listings'

export type GetBrandListingsOptions = Partial<{
  status: IListingStatus[]
  property_types: string[]
  property_subtypes: string[]
}>

const DEFAULT_OPTIONS: GetBrandListingsOptions = {
  status: ['Active'],
  property_types: ['Residential'],
  property_subtypes: [
    'RES-Single Family',
    'RES-Condo',
    'RES-Townhouse',
    'RES-Half Duplex',
    'RES-Farm/Ranch'
  ]
}

export async function getBrandListings(
  brand: UUID,
  options: GetBrandListingsOptions = DEFAULT_OPTIONS
): Promise<ICompactListing[]> {
  const response = await byValert(
    {
      brand,
      sort_order: ['status'],
      ...options
    },
    {},
    false
  )

  return response.data
}
