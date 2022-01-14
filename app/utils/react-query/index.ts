import produce, { Draft } from 'immer'
import { InfiniteData, QueryClient, QueryKey } from 'react-query'

export type UpdateCacheActions = {
  revert: () => void
  invalidate: () => void
}

export type UpdateCachePromise = Promise<UpdateCacheActions>

/**
 * Generate a composed function to call target cache functions at once
 * @param cachePromises
 * @returns
 */
export async function updateCacheComposer(
  ...cachePromises: UpdateCachePromise[]
): UpdateCachePromise {
  const caches = await Promise.all(cachePromises)

  return {
    revert: () => caches.forEach(cache => cache.revert()),
    invalidate: () => caches.forEach(cache => cache.invalidate())
  }
}

/**
 * Update an infiniteData cache and returns revert and invalidate functions
 * @param queryClient
 * @param queryKey
 * @param predictor
 * @param modifier
 * @returns
 */
export async function infiniteDataUpdateCacheActions<TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  predictor: (data: Draft<TData>) => boolean,
  modifier: (data: Draft<TData>) => void
): UpdateCachePromise {
  await queryClient.cancelQueries(queryKey, { exact: false })

  const matchedQueriesData = queryClient.getQueriesData<InfiniteData<TData[]>>({
    queryKey,
    exact: false
  })

  matchedQueriesData.forEach(([queryKey, infiniteData]) => {
    queryClient.setQueryData(
      queryKey,
      produce(infiniteData, draftPages => {
        draftPages.pages.forEach(items => {
          const item = items.find(item => predictor(item))

          if (!item) {
            return
          }

          modifier(item)
        })
      })
    )
  })

  return {
    revert: () => {
      matchedQueriesData.forEach(([queryKey, infiniteData]) => {
        queryClient.setQueryData(queryKey, infiniteData)
      })
    },
    invalidate: () => queryClient.invalidateQueries(queryKey, { exact: false })
  }
}

/**
 * Update the query cache for one object and returns revert and invalidate functions
 * @param queryClient
 * @param queryKey
 * @param modifier
 * @returns
 */
export async function updateCacheActions<TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  modifier: (data: Draft<TData>) => void
): UpdateCachePromise {
  await queryClient.cancelQueries(queryKey)

  const previousData = queryClient.getQueryData<TData>(queryKey)

  if (previousData) {
    queryClient.setQueryData<TData>(
      queryKey,
      produce(previousData, draft => modifier(draft))
    )
  }

  return {
    revert: () => {
      if (!previousData) {
        return
      }

      queryClient.setQueryData(queryKey, previousData)
    },
    invalidate: () => queryClient.invalidateQueries(queryKey)
  }
}
