import { ReactNode } from 'react'

import { SearchArticleImageCacheContext } from './context'
import { SearchArticleImageCache } from './types'

interface SearchArticleImageCacheProviderProps {
  children: ReactNode
  imageCache: SearchArticleImageCache
}

function SearchArticleImageCacheProvider({
  imageCache,
  children
}: SearchArticleImageCacheProviderProps) {
  return (
    <SearchArticleImageCacheContext.Provider value={imageCache}>
      {children}
    </SearchArticleImageCacheContext.Provider>
  )
}

export default SearchArticleImageCacheProvider
