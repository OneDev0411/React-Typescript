export function isValidUrl(url: string): boolean {
  try {
    const result = new URL(url)

    return ['http:', 'https:'].includes(result.protocol)
  } catch (_) {
    return false
  }
}

export function prependHTTPSIfNeeded(url: string): string {
  if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
    return url
  }

  return `https://${url}`
}
