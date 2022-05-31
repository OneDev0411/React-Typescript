import { SearchVideoSource } from '@app/views/components/SearchVideoDrawer/types'

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

export function getVideoTag(source: SearchVideoSource) {
  switch (source) {
    case 'videobolt':
    case 'gallery':
      return 'video'
    case 'youtube':
    case 'vimeo':
      return 'iframe'
    default:
      return 'iframe'
  }
}
