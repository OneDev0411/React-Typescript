import { UseQueryResult } from 'react-query'

import { useQuery } from '@app/hooks/query'
import { searchListings } from '@app/models/Deal/listing'

import { listingsList } from './keys'

export function useListingsList(
  criteria: string
): UseQueryResult<ICompactListing[]> {
  return useQuery(
    listingsList(criteria),
    (): Promise<ICompactListing[]> => searchListings(criteria),
    {
      enabled: criteria.trim().length >= 3
    }
  )
}
