import { useState, useEffect } from 'react'

import {
  useInfiniteScroll,
  InfiniteScrollingOptions
} from 'hooks/use-infinite-scroll'

interface UseInfinitePaginationOptions<T> {
  items: T[]
  pageSize?: number
  infiniteScrollProps?: Omit<
    InfiniteScrollingOptions,
    'onScrollBottom' | 'onScrollTop'
  >
}

export function useInfinitePagination<T>({
  items,
  pageSize = 12,
  infiniteScrollProps = {
    accuracy: 300,
    debounceTime: 100
  }
}: UseInfinitePaginationOptions<T>): T[] {
  const [loadedItemsCount, setLoadedItemsCount] = useState<number>(pageSize)

  const loadNextPage = () =>
    setLoadedItemsCount(loadedItemsCount =>
      Math.max(loadedItemsCount + pageSize, items.length)
    )

  useEffect(() => {
    setLoadedItemsCount(pageSize)
  }, [pageSize, items])

  useInfiniteScroll({
    ...infiniteScrollProps,
    onScrollBottom: loadNextPage
  })

  return items.slice(0, loadedItemsCount)
}
