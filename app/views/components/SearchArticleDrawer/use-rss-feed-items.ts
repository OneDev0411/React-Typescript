import { useEffect } from 'react'

import uniqBy from 'lodash/uniqBy'

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

      // The feed items come from different sources and it is possible to have duplicated articles
      // on the list. So to avoid that we need to make them unique.
      const uniqueRSSFeedItems = uniqBy(
        rssFeedItems,
        rssFeedItem => rssFeedItem.link
      )

      return sortRSSFeedItems(uniqueRSSFeedItems)
    })
  }, [run, rssSources])

  return {
    isLoading,
    rssFeedItems
  }
}
