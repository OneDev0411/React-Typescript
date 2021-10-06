import { NO_IMAGE_URL, RSS_SOURCES } from './constants'
import { RSSArticleMetadata, RSSFeedItem } from './types'

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
    description: rssFeedItem.content
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const result = new URL(url)

    return ['http:', 'https:'].includes(result.protocol)
  } catch (_) {
    return false
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

export function hasImageUrl(image: Optional<string>): boolean {
  return image !== undefined
}

export function isNoImageState(image: Optional<string>): boolean {
  return image === NO_IMAGE_URL
}

// Borrow and customize the below code from https://github.com/hustcc/timeago.js/blob/master/src/lang/en_short.ts
const EN_US = ['s', 'm', 'h', 'd', 'w', 'm', 'y']

export function localeENExtraShort(
  diff: number,
  idx: number
): [string, string] {
  if (idx === 0) {
    return ['now', 'now']
  }

  const unit = EN_US[Math.floor(idx / 2)]

  return [`${diff}${unit}`, `${diff}${unit}`]
}
