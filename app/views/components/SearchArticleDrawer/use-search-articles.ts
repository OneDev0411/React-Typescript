import { useCallback, useMemo } from 'react'

import Fuse from 'fuse.js'

import { convertFeedItemToArticleMetadata } from './helpers'
import { RSSArticleMetadata, RSSSource } from './types'
import { useRSSFeedItems } from './use-rss-feed-items'

interface UseSearchArticles {
  isArticlesLoading: boolean
  allArticles: RSSArticleMetadata[]
  searchArticles: (term: string) => RSSArticleMetadata[]
}

export function useSearchArticles(rssSources: RSSSource[]): UseSearchArticles {
  const { rssFeedItems, isLoading } = useRSSFeedItems(rssSources)

  const allArticles = useMemo(
    () => rssFeedItems.map(convertFeedItemToArticleMetadata),
    [rssFeedItems]
  )

  const searchArticles = useCallback(
    (term: string) => {
      if (!term) {
        return allArticles
      }

      return new Fuse(allArticles, {
        keys: ['title', 'content', 'publisher'],
        threshold: 0.7
      }).search(term)
    },
    [allArticles]
  )

  return {
    isArticlesLoading: isLoading,
    allArticles,
    searchArticles
  }
}
