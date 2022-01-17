import { UseInfiniteQueryResult } from 'react-query'

import { useInfiniteQuery } from '@app/hooks/query'

import { getAllSuperCampaigns, FetchRange } from './get-all-super-campaigns'
import { list } from './query-keys/campaign'

export type UseGetAllSuperCampaigns = UseInfiniteQueryResult<
  ISuperCampaign<'template_instance'>[]
>

const numberOfLoadSuperCampaignInRequest: number = 50
const initialRange: FetchRange = {
  start: 0,
  limit: numberOfLoadSuperCampaignInRequest
}

export function useGetAllSuperCampaigns(
  order?: string[]
): UseGetAllSuperCampaigns {
  return useInfiniteQuery(
    list(order),
    async ({ pageParam }: { pageParam?: FetchRange }) => {
      return getAllSuperCampaigns(pageParam ?? initialRange, order)
    },
    {
      getNextPageParam: (_, pages): FetchRange => {
        return {
          start: pages.length * numberOfLoadSuperCampaignInRequest,
          limit: numberOfLoadSuperCampaignInRequest
        }
      }
    }
  )
}
