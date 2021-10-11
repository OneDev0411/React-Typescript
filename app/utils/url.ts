export function isValidUrl(url: string): boolean {
  try {
    const result = new URL(url)

    return /^https?:$/.test(result.protocol)
  } catch (_) {
    return false
  }
}

export function prependHTTPSIfNeeded(url: string): string {
  if (/^https?:\/\//.test(url)) {
    return url
  }

  return `https://${url}`
}
