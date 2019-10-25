import { GifObject, GifItem } from './types'

export function getGifUrl(item: GifObject) {
  return item.media.length > 0 ? item.media[0].gif.url : ''
}
export function gifOutput(item: GifObject): GifItem | null {
  return item.media.length > 0 ? item.media[0].gif : null
}
