import superagent from 'superagent'

export function getYoutubeThumbnailUrl(
  url: string,
  size: 'small' | 'big' = 'big'
): string {
  const matches = url.match('[\\?&]v=([^&#]*)')
  const video = matches === null ? null : matches[1]

  if (!video) {
    return ''
  }

  if (size === 'small') {
    return `http://img.youtube.com/vi/${video}/2.jpg`
  }

  return `http://img.youtube.com/vi/${video}/0.jpg`
}

export async function getVimeoVideoThumbnailUrl(url: string): Promise<string> {
  const videoInfo = await superagent
    .get('https://vimeo.com/api/oembed.json')
    .query({
      url
    })

  // This equals to sth like it: https://i.vimeocdn.com/video/869860097_295x166.jpg
  // We need to use a bigger image, 600 in this case
  // That's why we are manipulating it
  const originalThumbnailUrl: string = videoInfo.body.thumbnail_url

  const videoIdPart = originalThumbnailUrl.split('_')[0]

  return `${videoIdPart}_600.jpg`
}

export async function getVideoThumbnailUrl(url: string): Promise<string> {
  if (url.includes('vimeo.com')) {
    return getVimeoVideoThumbnailUrl(url)
  }

  return getYoutubeThumbnailUrl(url)
}
