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
  thumbnail_url: 'https://i.vimeocdn.com/video/506427660-2e93a42675715090a52de8e6645d592c5f58c1a7e388231d801072c9b2d9843d-d_295x166'
  title: string
  uri: string
  upload_date: string
}
