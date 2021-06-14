import isEmail from 'validator/lib/isEmail'
import isUrl from 'validator/lib/isURL'
import isMobilePhone from 'validator/lib/isMobilePhone'

import { HipPocketListingUrlType } from './types'

export function getListingUrlTypeLabel(type: HipPocketListingUrlType): string {
  if (type === 'email') {
    return 'Email'
  }

  if (type === 'tel') {
    return 'Phone'
  }

  return 'Web'
}

export function getListingUrlTypeFieldPlaceholder(
  type: HipPocketListingUrlType
): string {
  if (type === 'email') {
    return 'Your email address'
  }

  if (type === 'tel') {
    return 'Your phone number'
  }

  return 'Your website address'
}

export function validateListingUrl(
  value: string,
  type: HipPocketListingUrlType
): true | string {
  if (value.length === 0) {
    return true
  }

  if (type === 'email') {
    return isEmail(value) ? true : 'Invalid email address'
  }

  if (type === 'tel') {
    return isMobilePhone(value, 'en-US') ? true : 'Invalid phone number'
  }

  return isUrl(value) ? true : 'Invalid website address'
}

export function getFormattedUrl(
  value: string,
  type: HipPocketListingUrlType
): string {
  if (value.length === 0) {
    return ''
  }

  if (type === 'email') {
    return `mailto:${value}`
  }

  if (type === 'tel') {
    return `tel:${value}`
  }

  return value
}
