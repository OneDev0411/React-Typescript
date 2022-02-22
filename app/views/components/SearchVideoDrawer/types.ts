export interface SearchVideoResult {
  url: string
  title: string
  thumbnail: string
  thumbnailAspectRatio: number
  publisher: string
  publishedAt: string
  sourceIcon: string
}

export type YouTubeVideoResource = gapi.client.youtube.SearchResult

export interface Video {
  url: string
  thumbnail?: string
  thumbnailAspectRatio?: number
}

// https://developer.vimeo.com/api/oembed/videos#embedding-a-video-with-oembed
export interface VimeoVideoResource {
  author_name: string
  thumbnail_url: string
  title: string
  upload_date: string
  video_id: number
  width: number
  height: number
}
