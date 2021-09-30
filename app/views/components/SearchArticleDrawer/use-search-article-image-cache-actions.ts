import { useContext } from 'react'

import { SearchArticleImageCacheContext } from './context'

export function useSearchArticleImageCacheActions() {
  const context = useContext(SearchArticleImageCacheContext)

  if (!context) {
    throw new Error(
      'The useSearchArticleImageCacheActions must be used within SearchArticleImageCacheProvider'
    )
  }

  return context
}
