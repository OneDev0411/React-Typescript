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
