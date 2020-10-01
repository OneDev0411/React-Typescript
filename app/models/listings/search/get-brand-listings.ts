import { byValert } from './get-listings'

export async function getBrandListings(
  brand: UUID
): Promise<ICompactListing[]> {
  const response = await byValert(
    {
      brand,
      limit: 9,
      sort_order: ['status'],
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
