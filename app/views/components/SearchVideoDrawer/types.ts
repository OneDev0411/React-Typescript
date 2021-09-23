import { Video } from '../VideoDrawer/types'

interface VideoResult<T> {
  type: T
  url: string
  title: string
  thumbnail: string
}

interface YouTubeVideoResult extends VideoResult<'youtube'> {
  channelURL: string
  channelTitle: string
  publishedAt: string
}

interface VimeoVideoResult extends VideoResult<'vimeo'> {}

export type SearchVideoResult = YouTubeVideoResult | VimeoVideoResult

export type GoogleApiYouTubeSearchResource = gapi.client.youtube.SearchResult

// TODO: move this type to a global scope and sue it on both this component and VideoDrawer
export type VideoInfo = Video
