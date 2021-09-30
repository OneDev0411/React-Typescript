import { createContext } from 'react'

import { SearchArticleImageCacheActions } from './types'

export const SearchArticleImageCacheContext =
  createContext<Optional<SearchArticleImageCacheActions>>(undefined)
