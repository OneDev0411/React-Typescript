export interface SearchVideoResult {
  url: string
  title: string
  thumbnail: string
  publisher: string
  publishedAt: string
}

export type YouTubeVideoResource = gapi.client.youtube.SearchResult

// TODO: move this type to a global scope and sue it on both this component and VideoDrawer
export interface Video {
  url: string
  thumbnail?: string
}

// https://developer.vimeo.com/api/oembed/videos#embedding-a-video-with-oembed
export interface VimeoVideoResource {
  author_name: string
  thumbnail_url: string
  title: string
  upload_date: string
  video_id: number
}
