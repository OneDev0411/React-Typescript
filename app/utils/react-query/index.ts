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
 * Update the query cache for one object and returns revert and invalidate functions
 * @param queryClient
 * @param queryKey
 * @param modifier
 * @returns
 */
export async function updateCacheActions<TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  modifier: (data: Draft<TData>, base: TData) => void
): UpdateCachePromise {
  await queryClient.cancelQueries(queryKey)

  const matchedData = queryClient.getQueriesData<TData>(queryKey)

  matchedData.forEach(([queryKey, previousData]) => {
    queryClient.setQueryData<TData>(
      queryKey,
      produce(previousData, draft => modifier(draft, previousData))
    )
  })

  return {
    revert: () => {
      matchedData.forEach(([queryKey, previousData]) => {
        queryClient.setQueryData(queryKey, previousData)
      })
    },
    invalidate: () => queryClient.invalidateQueries(queryKey)
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
  predictor: (data: TData) => boolean,
  modifier: (
    data: Draft<TData>,
    items: Draft<TData>[],
    itemIndex: number
  ) => void
): UpdateCachePromise {
  return updateCacheActions<InfiniteData<TData[]>>(
    queryClient,
    queryKey,
    (draftPages, basePages) => {
      basePages.pages.forEach((items, pageIndex) => {
        const itemIndex = items.findIndex(item => predictor(item))

        if (itemIndex === -1) {
          return
        }

        modifier(
          draftPages.pages[pageIndex][itemIndex],
          draftPages.pages[pageIndex],
          itemIndex
        )
      })
    }
  )
}

/**
 * Delete something from an infiniteData cache and returns revert and invalidate functions
 * @param queryClient
 * @param queryKey
 * @param predictor
 * @param modifier
 * @returns
 */
export async function infiniteDataDeleteCacheActions<TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  predictor: (data: TData) => boolean
): UpdateCachePromise {
  return infiniteDataUpdateCacheActions<TData>(
    queryClient,
    queryKey,
    predictor,
    (_, items, itemIndex) => {
      items.splice(itemIndex, 1)
    }
  )
}
