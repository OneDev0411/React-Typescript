import config from '../../../../config/public'

import { GifObject, GifItem } from './types'

export function getGifUrl(item: GifObject) {
  return item.media.length > 0 ? item.media[0].gif.url : ''
}

export function gifOutput(item: GifObject): GifItem | null {
  return item.media.length > 0 ? item.media[0].gif : null
}

export function tenorApi(section: string, q: string[] = []) {
  const queries = [`key=${config.tenor.api_key}`, 'media_filter=minimal', ...q]
  const urlQuery = queries.join('&')

  return `https://api.tenor.com/v1/${section}/?${urlQuery}`
}
