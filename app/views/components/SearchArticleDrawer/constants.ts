import { RSSSource } from './types'

export const RSS_SOURCES: RSSSource[] = [
  {
    icon: 'https://assets-far.rdc.moveaws.com/static/assets/images/favicon.ico',
    title: 'realtor.com',
    url: 'http://feeds.feedburner.com/real-estate-story-ideas'
  },
  {
    icon: 'https://www.cnbc.com/favicon.ico',
    title: 'CNBC',
    url: 'https://www.cnbc.com/id/10000115/device/rss/rss.html'
  },
  {
    icon: 'https://s.wsj.net/media/wsj_apple-touch-icon-57x57.png',
    title: 'WallStreet Journal',
    url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml'
  }
]

export const INITIAL_SEARCH_TERM = 'architectural digest'
