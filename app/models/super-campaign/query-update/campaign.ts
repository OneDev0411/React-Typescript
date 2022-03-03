import { QueryClient } from 'react-query'

import {
  infiniteDataDeleteCacheActions,
  infiniteDataUpdateCacheActions,
  updateCacheActions,
  UpdateCachePromise
} from '@app/utils/react-query'

import { detail, allList, myList } from '../query-keys/campaign'

export async function updateCacheDetail(
  queryClient: QueryClient,
  superCampaignId: UUID,
  update: Partial<ISuperCampaign<'template_instance'>>
): UpdateCachePromise {
  return updateCacheActions<ISuperCampaign<'template_instance'>>(
    queryClient,
    detail(superCampaignId),
    superCampaign => {
      Object.assign(superCampaign, update)
    }
  )
}

export async function updateCacheAllList(
  queryClient: QueryClient,
  superCampaignId: UUID,
  update: Partial<ISuperCampaign<'template_instance'>>
): UpdateCachePromise {
  return infiniteDataUpdateCacheActions<ISuperCampaign<'template_instance'>>(
    queryClient,
    allList(),
    superCampaign => superCampaignId === superCampaign.id,
    superCampaign => {
      Object.assign(superCampaign, update)
    }
  )
}

export async function deleteFromCacheAllList(
  queryClient: QueryClient,
  superCampaignId: UUID
): UpdateCachePromise {
  return infiniteDataDeleteCacheActions<ISuperCampaign<'template_instance'>>(
    queryClient,
    allList(),
    superCampaign => superCampaignId === superCampaign.id
  )
}

export async function updateCacheMyList(
  queryClient: QueryClient,
  superCampaignId: UUID,
  update: Partial<ISuperCampaign<'template_instance' | 'created_by'>>
): UpdateCachePromise {
  return updateCacheActions<
    ISuperCampaign<'template_instance' | 'created_by'>[]
  >(queryClient, myList(), superCampaigns => {
    const index = superCampaigns.findIndex(
      superCampaign => superCampaign.id === superCampaignId
    )

    if (index === -1) {
      return
    }

    superCampaigns.splice(index, 1, {
      ...superCampaigns[index],
      ...update
    })
  })
}

export async function deleteFromCacheMyList(
  queryClient: QueryClient,
  superCampaignId: UUID
): UpdateCachePromise {
  return updateCacheActions<
    ISuperCampaign<'template_instance' | 'created_by'>[]
  >(queryClient, myList(), superCampaigns => {
    const index = superCampaigns.findIndex(
      superCampaign => superCampaign.id === superCampaignId
    )

    if (index === -1) {
      return
    }

    superCampaigns.splice(index, 1)
  })
}
