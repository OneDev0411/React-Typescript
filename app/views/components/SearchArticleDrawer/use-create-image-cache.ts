import { useMemo, useRef } from 'react'

import { SearchArticleImageCache } from './types'

export function useCreateImageCache(): SearchArticleImageCache {
  const cacheRef = useRef<Record<string, string>>({})

  const cacheActions = useMemo<SearchArticleImageCache>(
    () => ({
      setItem: (articleUrl: string, imageUrl: string) => {
        cacheRef.current[articleUrl] = imageUrl
      },
      getItem: (articleUrl: string) => {
        return cacheRef.current[articleUrl]
      }
    }),
    []
  )

  return cacheActions
}
