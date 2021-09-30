import { ReactNode, useMemo, useRef } from 'react'

import { SearchArticleImageCacheContext } from './context'
import { SearchArticleImageCacheActions } from './types'

interface SearchArticleImageCacheProviderProps {
  children: ReactNode
}

function SearchArticleImageCacheProvider({
  children
}: SearchArticleImageCacheProviderProps) {
  const cacheRef = useRef<Record<string, string>>({})

  const contextValue = useMemo<SearchArticleImageCacheActions>(
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

  return (
    <SearchArticleImageCacheContext.Provider value={contextValue}>
      {children}
    </SearchArticleImageCacheContext.Provider>
  )
}

export default SearchArticleImageCacheProvider
