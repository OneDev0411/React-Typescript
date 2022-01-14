import { QueryClient } from 'react-query'

import {
  infiniteDataUpdateCacheActions,
  updateCacheActions,
  UpdateCachePromise
} from '@app/utils/react-query'

import { getOne, getAll } from '../query-keys/campaign'

export async function updateCacheOne(
  queryClient: QueryClient,
  superCampaignId: UUID,
  update: Partial<ISuperCampaign<'template_instance'>>
): UpdateCachePromise {
  return updateCacheActions<ISuperCampaign<'template_instance'>>(
    queryClient,
    getOne(superCampaignId),
    superCampaign => {
      Object.assign(superCampaign, update)
    }
  )
}

export async function updateCacheAll(
  queryClient: QueryClient,
  superCampaignId: UUID,
  update: Partial<ISuperCampaign<'template_instance'>>
): UpdateCachePromise {
  return infiniteDataUpdateCacheActions<ISuperCampaign<'template_instance'>>(
    queryClient,
    getAll(),
    superCampaign => superCampaignId === superCampaign.id,
    superCampaign => {
      Object.assign(superCampaign, update)
    }
  )
}
