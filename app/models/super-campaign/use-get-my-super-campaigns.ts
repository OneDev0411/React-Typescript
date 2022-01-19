import { UseQueryResult } from 'react-query'

import { useQuery } from '@app/hooks/query'

import { getMySuperCampaigns } from './get-my-super-campaigns'
import { myList } from './query-keys/campaign'

export type UseGetMySuperCampaigns = UseQueryResult<
  ISuperCampaign<'template_instance' | 'created_by'>[]
>

export function useGetMySuperCampaigns(limit?: number): UseGetMySuperCampaigns {
  return useQuery(myList(limit), async () => getMySuperCampaigns(limit))
}
