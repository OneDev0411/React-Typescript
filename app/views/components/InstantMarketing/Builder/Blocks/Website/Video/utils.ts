export function getYouTubeVideoId(url: string) {
  return new URL(url).searchParams.get('v')
}

export function getVimeoVideoId(url: string) {
  return url.split('/').pop()
}

export function generateEmbedVideoUrl(url: string) {
  if (url.includes('youtube.com')) {
    return `https://www.youtube.com/embed/${getYouTubeVideoId(url)}?autoplay=0`
  }

  if (url.includes('vimeo.com')) {
    return `https://player.vimeo.com/video/${getVimeoVideoId(url)}?autoplay=0`
  }

  return url
}
