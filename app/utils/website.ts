export function isWebsiteOnSubdomain(url: string) {
  return url.indexOf('rechat.site') !== -1
}

export function generateWebsiteUrl(hostname: string) {
  return 'http://' + hostname
}
