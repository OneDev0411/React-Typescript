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
  createdDate?: string
}

export interface RSSFeedItem extends Parser.Item {
  sourceIndex: number
  createdDate?: string
  image: Optional<string>
}

export type RSSFeed = Parser.Output<RSSFeedItem>

export interface SearchArticleImageCache {
  setItem: (articleUrl: string, imageUrl: string) => void
  getItem: (articleUrl: string) => Optional<string>
}

export interface RSSSource {
  title: string
  icon: string
  url: string
  imageSanitizer?: (image: string) => string
}

export type RSSSearchErrorCode = 'CloudflareProtected' | 'MetadataNotFound'
