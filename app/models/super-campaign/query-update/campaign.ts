import { QueryClient } from 'react-query'

import {
  infiniteDataDeleteCacheActions,
  infiniteDataUpdateCacheActions,
  updateCacheActions,
  UpdateCachePromise
} from '@app/utils/react-query'

import { detail, list } from '../query-keys/campaign'

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

export async function updateCacheList(
  queryClient: QueryClient,
  superCampaignId: UUID,
  update: Partial<ISuperCampaign<'template_instance'>>
): UpdateCachePromise {
  return infiniteDataUpdateCacheActions<ISuperCampaign<'template_instance'>>(
    queryClient,
    list(),
    superCampaign => superCampaignId === superCampaign.id,
    superCampaign => {
      Object.assign(superCampaign, update)
    }
  )
}

export async function deleteFromCacheAll(
  queryClient: QueryClient,
  superCampaignId: UUID
): UpdateCachePromise {
  return infiniteDataDeleteCacheActions<ISuperCampaign<'template_instance'>>(
    queryClient,
    list(),
    superCampaign => superCampaignId === superCampaign.id
  )
}
