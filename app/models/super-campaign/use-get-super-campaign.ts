import {
  useQueryClient,
  InfiniteData,
  UseQueryResult,
  UseQueryOptions
} from 'react-query'
import { ResponseError } from 'superagent'

import { useQuery } from '@app/hooks/query'

import { getSuperCampaign } from './get-super-campaign'
import { getOne, getAll } from './query-keys/campaign'

export type UseGetSuperCampaign = UseQueryResult<
  ISuperCampaign<'template_instance'>,
  ResponseError
>

export type UseGetSuperCampaignOptions = Pick<
  UseQueryOptions<ISuperCampaign<'template_instance'>, ResponseError>,
  'onError'
>

export function useGetSuperCampaign(
  superCampaignId: UUID,
  options: UseGetSuperCampaignOptions
): UseGetSuperCampaign {
  const queryClient = useQueryClient()

  return useQuery(
    getOne(superCampaignId),
    async () => getSuperCampaign(superCampaignId),
    {
      initialData: () => {
        const pages =
          queryClient.getQueryData<
            InfiniteData<ISuperCampaign<'template_instance'>[]>
          >(getAll(), { exact: false })?.pages ?? []

        const superCampaigns = pages.reduce(
          (items, page) => [...items, ...page],
          []
        )

        return superCampaigns.find(d => d.id === superCampaignId)
      },
      ...options
    }
  )
}
