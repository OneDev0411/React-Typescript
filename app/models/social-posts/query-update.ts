import { QueryClient } from 'react-query'

import {
  UpdateCachePromise,
  infiniteDataDeleteCacheActions,
  infiniteDataUpdateCacheActions
} from '@app/utils/react-query'

import { list } from './query-keys'

export function deleteFromCacheList(
  queryClient: QueryClient,
  brandId: UUID,
  socialPostId: UUID
): UpdateCachePromise {
  return infiniteDataDeleteCacheActions<ISocialPost<'template_instance'>>(
    queryClient,
    list(brandId),
    socialPost => socialPostId === socialPost.id
  )
}

export async function updateCacheList(
  queryClient: QueryClient,
  brandId: UUID,
  socialPostId: UUID,
  update: Partial<ISocialPost>
): UpdateCachePromise {
  return infiniteDataUpdateCacheActions<ISocialPost>(
    queryClient,
    list(brandId),
    socialPost => socialPostId === socialPost.id,
    socialPost => {
      Object.assign(socialPost, update)
    }
  )
}
