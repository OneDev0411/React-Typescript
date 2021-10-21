import { createContext } from 'react'

import { SearchArticleImageCache } from './types'

export const SearchArticleImageCacheContext =
  createContext<Optional<SearchArticleImageCache>>(undefined)
