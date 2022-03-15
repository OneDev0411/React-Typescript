import { QueryClient } from 'react-query'

import { UpdateCachePromise, updateCacheActions } from '@app/utils/react-query'

import { list } from './query-keys'

export function deleteFromCacheList(
  queryClient: QueryClient,
  brandId: UUID,
  socialPostId: UUID
): UpdateCachePromise {
  return updateCacheActions<ISocialPost[]>(
    queryClient,
    list(brandId),
    socialPosts => {
      const index = socialPosts.findIndex(
        socialPost => socialPost.id === socialPostId
      )

      if (index === -1) {
        return
      }

      socialPosts.splice(index, 1)
    }
  )
}
