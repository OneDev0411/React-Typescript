import {
  useQueryClient,
  InfiniteData,
  UseQueryResult,
  UseQueryOptions
} from 'react-query'
import { ResponseError } from 'superagent'

import { useQuery } from '@app/hooks/query'

import { getSuperCampaign } from './get-super-campaign'
import { detail, list } from './query-keys/campaign'

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
    detail(superCampaignId),
    async () => getSuperCampaign(superCampaignId),
    {
      initialData: () => {
        const pages =
          queryClient.getQueryData<
            InfiniteData<ISuperCampaign<'template_instance'>[]>
          >(list(), { exact: false })?.pages ?? []

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
