import { byValert } from './get-listings'

interface Options {
  status: IListingStatus[]
}

export async function getBrandListings(
  brand: UUID,
  { status }: Options = { status: ['Active'] }
): Promise<ICompactListing[]> {
  const response = await byValert(
    {
      brand,
      sort_order: ['status'],
      status,
      property_types: ['Residential'],
      property_subtypes: [
        'RES-Single Family',
        'RES-Condo',
        'RES-Townhouse',
        'RES-Half Duplex',
        'RES-Farm/Ranch'
      ]
    },
    {},
    false
  )

  return response.data
}
