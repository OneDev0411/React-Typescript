import { useEffect } from 'react'

import useAsync from '@app/hooks/use-async'

import { sortRSSFeedItems } from './helpers'
import { getRSSFeeds } from './models'
import { RSSFeedItem, RSSSource } from './types'

interface UseRSSFeedItems {
  isLoading: boolean
  rssFeedItems: RSSFeedItem[]
}

export function useRSSFeedItems(rssSources: RSSSource[]): UseRSSFeedItems {
  const {
    run,
    data: rssFeedItems,
    isLoading
  } = useAsync<RSSFeedItem[]>({ data: [], status: 'pending' })

  useEffect(() => {
    run(async () => {
      const rssFeeds = await getRSSFeeds(rssSources)

      const rssFeedItems = rssFeeds.reduce<RSSFeedItem[]>(
        (feedItems, feedItem) => [...feedItems, ...feedItem.items],
        []
      )

      return sortRSSFeedItems(rssFeedItems)
    })
  }, [run, rssSources])

  return {
    isLoading,
    rssFeedItems
  }
}
