import { RSS_SOURCES } from './constants'
import { RSSArticleMetadata, RSSFeedItem } from './types'

export function convertFeedItemToArticleMetadata(
  rssFeedItem: RSSFeedItem
): RSSArticleMetadata {
  const source = RSS_SOURCES[rssFeedItem.sourceIndex]

  return {
    title: rssFeedItem.title ?? '',
    url: rssFeedItem.link ?? '',
    publishDate: rssFeedItem.pubDate ?? '',
    publisher: source.title,
    publisherIcon: source.icon
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
