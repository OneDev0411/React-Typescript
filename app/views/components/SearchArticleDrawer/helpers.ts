import { RSS_SOURCES } from './constants'
import { RSSArticleMetadata, RSSFeedItem, RSSSource } from './types'

function getRSSFeedItemImage(rssFeedItem: RSSFeedItem, source: RSSSource) {
  if (!source.useImage) {
    return
  }

  if (source.imageSanitizer && rssFeedItem.image) {
    return source.imageSanitizer(rssFeedItem.image)
  }

  return rssFeedItem.image
}

export function convertFeedItemToArticleMetadata(
  rssFeedItem: RSSFeedItem
): RSSArticleMetadata {
  const source = RSS_SOURCES[rssFeedItem.sourceIndex]

  return {
    title: rssFeedItem.title ?? '',
    url: rssFeedItem.link ?? '',
    publishDate: rssFeedItem.pubDate,
    createdDate: rssFeedItem.createdDate,
    publisher: source.title,
    publisherIcon: source.icon,
    description: rssFeedItem.content,
    image: getRSSFeedItemImage(rssFeedItem, source)
  }
}

export function sortRSSFeedItems(feedItems: RSSFeedItem[]): RSSFeedItem[] {
  return [...feedItems].sort((a, b) => {
    const date1 = a.pubDate ?? a.createdDate
    const date2 = b.pubDate ?? b.createdDate

    const day0 = new Date(0)

    const time1 = date1 ? new Date(date1) : day0
    const time2 = date2 ? new Date(date2) : day0

    if (time1 > time2) {
      return -1
    }

    if (time1 < time2) {
      return 1
    }

    return 0
  })
}
