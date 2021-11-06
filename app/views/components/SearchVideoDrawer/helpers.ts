import { YouTubeVideoResource } from './types'

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
