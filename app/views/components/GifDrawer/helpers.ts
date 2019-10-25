import { GifObject } from './types'

export function getGifUrl(item: GifObject) {
  return item.media.length > 0 ? item.media[0].gif.url : ''
}
