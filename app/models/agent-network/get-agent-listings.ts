import { byValert } from '@app/models/listings/search/get-listings'

export default async function getAgentListings(
  filters: AlertFilters
): Promise<ICompactListing[]> {
  const response = await byValert(filters, {}, false)

  return response.data
}
