import { NO_IMAGE_URL } from './constants'

export function hasImageUrl(image: Optional<string>): boolean {
  return image !== undefined
}

export function isNoImageState(image: Optional<string>): boolean {
  return image === NO_IMAGE_URL
}

// Borrow and customize the below code from https://github.com/hustcc/timeago.js/blob/master/src/lang/en_short.ts
const EN_US = ['s', 'm', 'h', 'd', 'w', 'mo', 'yr']

export function localeENExtraShort(
  diff: number,
  idx: number
): [string, string] {
  if (idx === 0) {
    return ['now', 'now']
  }

  const unit = EN_US[Math.floor(idx / 2)]

  return [`${diff}${unit}`, `${diff}${unit}`]
}
