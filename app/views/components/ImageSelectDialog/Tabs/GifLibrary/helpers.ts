import config from 'config'

import { GifObject } from './types'

export function getGifUrl(item: GifObject): string {
  return item.media[0].gif.url ?? ''
}

export function getTenorApiRequestUrl(
  api: string,
  queryParams: string[] = []
): string {
  const queries = [
    `key=${config.tenor.api_key}`,
    'media_filter=minimal',
    ...queryParams
  ]
  const urlQuery = queries.join('&')

  return `https://api.tenor.com/v1/${api}/?${urlQuery}`
}
