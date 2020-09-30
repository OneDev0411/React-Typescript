import { byValert } from './get-listings'

export async function getBrandListings(
  brand: UUID
): Promise<ICompactListing[]> {
  const response = await byValert({
    brand,
    limit: 200,
    sort_order: ['status'],
    property_types: ['Residential'],
    property_subtypes: [
      'RES-Single Family',
      'RES-Condo',
      'RES-Townhouse',
      'RES-Half Duplex',
      'RES-Farm/Ranch'
    ]
  })

  return Object.keys(response.entities.listings).map(
    id => response.entities.listings[id]
  )
}
