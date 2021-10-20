export function isValidUrl(url: string): boolean {
  if (url.includes(' ')) {
    return false
  }

  try {
    const result = new URL(url)

    return (
      /^https?:$/.test(result.protocol) && /\.[^\.]+$/.test(result.hostname)
    )
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
