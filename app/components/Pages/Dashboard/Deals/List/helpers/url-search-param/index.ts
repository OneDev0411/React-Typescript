const QUERY_PARAM_NAME = 'q'

export function getUrlSearchParam() {
  const value =
    new URLSearchParams(window.location.search).get(QUERY_PARAM_NAME) || ''

  return decodeURIComponent(value)
}

export function setUrlSearchParam(value: string) {
  const url = new URL(window.location.href)

  url.searchParams.set(QUERY_PARAM_NAME, encodeURIComponent(value))

  // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
  window.history.pushState({}, '', url.toString())
}
