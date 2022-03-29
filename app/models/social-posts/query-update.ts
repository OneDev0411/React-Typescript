import { QueryClient } from 'react-query'

import {
  UpdateCachePromise,
  infiniteDataDeleteCacheActions
} from '@app/utils/react-query'

import { list } from './query-keys'

export function deleteFromCacheList(
  queryClient: QueryClient,
  brandId: UUID,
  socialPostId: UUID
): UpdateCachePromise {
  return infiniteDataDeleteCacheActions<ISuperCampaign<'template_instance'>>(
    queryClient,
    list(brandId),
    socialPost => socialPostId === socialPost.id
  )
}
