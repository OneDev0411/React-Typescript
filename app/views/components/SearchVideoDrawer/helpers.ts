import superagent from 'superagent'

import {
  SearchVideoResult,
  SearchVideoSource,
  VideoboltVideo,
  YouTubeVideoResource
} from './types'

const REQUEST_TIMEOUT_MS = 120 * 1000

// The date format provided by Vimeo is not supported on Safari so we need to
// replace the space with T character to make it standard
export function makeVimeoDateStandard(date: string): string {
  return date.replace(' ', 'T')
}

function isYouTubeUrl(urlInfo: URL): boolean {
  return urlInfo.host === 'www.youtube.com'
}

export function getYouTubeVideoId(term: string): Nullable<string> {
  try {
    const urlInfo = new URL(term)

    if (!isYouTubeUrl(urlInfo)) {
      return null
    }

    return urlInfo.searchParams.get('v')
  } catch (_) {
    return null
  }
}

export function youtubeSearch(term: string): Promise<YouTubeVideoResource[]> {
  return new Promise<YouTubeVideoResource[]>((resolve, reject) => {
    gapi.client.youtube.search
      .list({
        part: ['snippet'],
        type: ['video'],
        maxResults: 30,
        q: term
      })
      .then(response => resolve(response.result.items ?? []), reject)
  })
}

export function youtubeVideos(
  videoId: string
): Promise<YouTubeVideoResource[]> {
  return new Promise<YouTubeVideoResource[]>((resolve, reject) => {
    gapi.client.youtube.videos
      .list({
        part: ['snippet'],
        id: [videoId]
      })
      .then(
        response =>
          resolve(
            response.result.items?.map<YouTubeVideoResource>(item => ({
              id: { videoId: item.id },
              snippet: {
                thumbnails: item.snippet?.thumbnails,
                title: item.snippet?.title,
                channelTitle: item.snippet?.channelTitle,
                publishedAt: item.snippet?.publishedAt
              }
            })) ?? []
          ),
        reject
      )
  })
}

export async function getYouTubeVideoGif(
  url: string
): Promise<{ url: string }> {
  const response = await superagent
    .post('/api/utils/get-youtube-video-gif')
    .timeout(REQUEST_TIMEOUT_MS)
    .retry(2)
    .send({ url })

  return response.body
}

export async function getVideoGif(url: string): Promise<{ url: string }> {
  const response = await superagent
    .post('/api/utils/get-video-gif')
    .timeout(REQUEST_TIMEOUT_MS)
    .retry(2)
    .send({ url })

  return response.body
}

export async function getVideoboltVideos(
  email: string
): Promise<VideoboltVideo[]> {
  const response = await superagent
    .post('/api/utils/get-videobolt-videos')
    .retry(2)
    .send({ email })

  return response.body.videos ?? []
}

export function getVideoPlayerUrl(url: string): string {
  return `${window.location.origin}/dashboard/player?video=${encodeURIComponent(
    url
  )}`
}

export function shouldAddPlayIconWatermark(
  videoSource: SearchVideoSource
): boolean {
  const watermarkBlacklist: SearchVideoSource[] = [
    'youtube',
    'videobolt',
    'gallery'
  ]

  return !watermarkBlacklist.includes(videoSource)
}

export function createGalleryVideoObject(
  asset: IBrandAsset
): SearchVideoResult {
  return {
    source: 'gallery',
    playerUrl: getVideoPlayerUrl(asset.file.url),
    url: asset.file.url,
    title: asset.label || 'No Label',
    publishedAt: new Date(asset.created_at * 1000).toISOString(),
    sourceIcon: '/static/images/favicons/favicon-32x32.png'
  }
}
