import { useEffect } from 'react'

import useAsync from '@app/hooks/use-async'

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

      return rssFeeds.reduce(
        (feedItems, feedItem) => [...feedItems, ...feedItem.items],
        []
      )
    })
  }, [run, rssSources])

  return {
    isLoading,
    rssFeedItems
  }
}
