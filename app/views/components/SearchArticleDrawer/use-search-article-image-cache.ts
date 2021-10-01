import { useContext } from 'react'

import { SearchArticleImageCacheContext } from './context'

export function useSearchArticleImageCache() {
  const context = useContext(SearchArticleImageCacheContext)

  if (!context) {
    throw new Error(
      'The useSearchArticleImageCache must be used within SearchArticleImageCacheProvider'
    )
  }

  return context
}
