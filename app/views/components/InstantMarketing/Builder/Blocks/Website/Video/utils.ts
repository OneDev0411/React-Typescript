export function getYouTubeVideoId(url: string) {
  return new URL(url).searchParams.get('v')
}

export function getVimeoVideoId(url: string) {
  return url.split('/').pop()
}

export function generateEmbedVideoUrl(url: string) {
  if (url.indexOf('youtube.com') > -1) {
    return `https://www.youtube.com/embed/${getYouTubeVideoId(url)}?autoplay=0`
  }

  if (url.indexOf('vimeo.com') > -1) {
    return `https://player.vimeo.com/video/${getVimeoVideoId(url)}?autoplay=0`
  }

  return url
}
