import { byValert } from '@app/models/listings/search/get-listings'

export default async function getAgentListings(
  id: UUID
): Promise<ICompactListing[]> {
  const response = await byValert({ agents: [id] }, {}, false)

  return response.data
}
