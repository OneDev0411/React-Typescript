export type SearchVideoSource = 'youtube' | 'vimeo' | 'videobolt' | 'gallery'
export interface SearchVideoResult {
  playerUrl: string
  url: string
  title?: string
  thumbnail?: string
  publisher?: string
  publishedAt?: string
  sourceIcon: string
  source: SearchVideoSource
}

export type YouTubeVideoResource = gapi.client.youtube.SearchResult

export interface Video {
  url: string
  thumbnail?: string
  thumbnailWithPlayIcon?: string
  source: SearchVideoSource
}

// https://developer.vimeo.com/api/oembed/videos#embedding-a-video-with-oembed
export interface VimeoVideoResource {
  author_name: string
  thumbnail_url: string
  title: string
  upload_date: string
  video_id: number
}

export interface VideoboltVideo {
  listing_id: string
  timestamp: string
  type: string
  video_url_branded: string
  video_url_clean: string
  video_url_square: string
  video_landing_page: string
  edit_video: string
  region: string
  qr: string
  email: string
}

export enum VideoTab {
  Online = 'online',
  Gallery = 'gallery',
  Videobolt = 'videobolt'
}
