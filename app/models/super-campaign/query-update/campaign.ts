import { QueryClient } from 'react-query'

import { getOne } from '../query-keys/campaign'

export type UpdateCacheActions = {
  revert: () => void
  invalidate: () => void
}

export type UpdateCacheReturn = Promise<UpdateCacheActions>

export async function updateCacheOne(
  queryClient: QueryClient,
  superCampaignId: UUID,
  update: Partial<ISuperCampaign<'template_instance'>>
): UpdateCacheReturn {
  await queryClient.cancelQueries(getOne(superCampaignId))

  const previousSuperCampaign = queryClient.getQueryData<
    ISuperCampaign<'template_instance'>
  >(getOne(superCampaignId))

  if (previousSuperCampaign) {
    queryClient.setQueryData<ISuperCampaign<'template_instance'>>(
      getOne(superCampaignId),
      { ...previousSuperCampaign, ...update }
    )
  }

  return {
    revert: () => {
      if (!previousSuperCampaign) {
        return
      }

      queryClient.setQueryData(getOne(superCampaignId), previousSuperCampaign)
    },
    invalidate: () => queryClient.invalidateQueries(getOne(superCampaignId))
  }
}
