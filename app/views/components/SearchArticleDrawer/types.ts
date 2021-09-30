import Parser from 'rss-parser'

export interface ArticleMetadata {
  description?: string
  image?: string
  title: string
  url: string
}

export interface RSSArticleMetadata extends ArticleMetadata {
  publisher?: string
  publisherIcon?: string
  publishDate?: string
}

export type RSSFeed = Parser.Output<{ sourceIndex: number }>

export interface RSSFeedItem extends Parser.Item {
  sourceIndex: number
}

export interface ArticleMetadataResponse {
  response?: ArticleMetadata
  error?: string
}

export interface SearchArticleImageCacheActions {
  setItem: (articleUrl: string, imageUrl: string) => void
  getItem: (articleUrl: string) => Optional<string>
}

export interface RSSSource {
  title: string
  icon: string
  url: string
}
