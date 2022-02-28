import { QueryClient } from 'react-query'

import { UpdateCachePromise, updateCacheActions } from '@app/utils/react-query'

import { list } from './query-keys'

export function deleteFromCacheAllList(
  queryClient: QueryClient,
  facebookPageId: string
): UpdateCachePromise {
  return updateCacheActions<IFacebookPage[]>(
    queryClient,
    list(),
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
