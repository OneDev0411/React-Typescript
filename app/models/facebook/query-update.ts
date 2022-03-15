import { QueryClient } from 'react-query'

import { UpdateCachePromise, updateCacheActions } from '@app/utils/react-query'

import { list } from './query-keys'

export function deleteFromCacheList(
  queryClient: QueryClient,
  brandId: UUID,
  facebookPageId: string
): UpdateCachePromise {
  return updateCacheActions<IFacebookPage[]>(
    queryClient,
    list(brandId),
    facebookPages => {
      const index = facebookPages.findIndex(
        facebookPage => facebookPage.id === facebookPageId
      )

      if (index === -1) {
        return
      }

      facebookPages.splice(index, 1)
    }
  )
}
