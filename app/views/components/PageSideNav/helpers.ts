export function isOnThisUrl(url, isIndex) {
  const currentLocation = window.location.pathname

  if (isIndex) {
    return currentLocation === url
  }

  return currentLocation.includes(url)
}
