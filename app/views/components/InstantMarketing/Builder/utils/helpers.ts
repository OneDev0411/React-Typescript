import { Model } from 'backbone'

import {
  IMAGE_TOOLBAR_BUTTONS_PREFIX,
  IMAGE_ELEMENT_TYPES,
  BACKGROUND_IMAGE_ALLOWED_ELEMENT_TYPES,
  BACKGROUND_URL_ALLOWED_ELEMENT_TYPES
} from '../constants'

export function isImage(model: Model): boolean {
  const elementType = model.get('type')

  return IMAGE_ELEMENT_TYPES.includes(elementType)
}

export function isBackgroundImageAllowed(model: Model): boolean {
  const elementType = model.get('type')

  return BACKGROUND_IMAGE_ALLOWED_ELEMENT_TYPES.includes(elementType)
}

export function isBackgroundUrlAllowed(model: Model): boolean {
  const elementType = model.get('type')

  return BACKGROUND_URL_ALLOWED_ELEMENT_TYPES.includes(elementType)
}

export function hasToolbarImageButtons(model: Model): boolean {
  const toolbar: any[] = model.get('toolbar')

  return toolbar.some(
    item => item.name && item.name.startsWith(IMAGE_TOOLBAR_BUTTONS_PREFIX)
  )
}

export function setImage(model: Model, url: string): void {
  const isImageElement = isImage(model)

  if (isImageElement) {
    // @ts-ignore
    model.setAttributes({
      // @ts-ignore
      ...model.getAttributes(),
      src: url
    })
    model.set('src', url)

    return
  }

  const isBackgroundImageAllowedElement = isBackgroundImageAllowed(model)

  if (isBackgroundImageAllowedElement) {
    const elementStyle = { ...model.get('style') }

    elementStyle['background-image'] = `url(${url})`
    model.set('style', elementStyle)

    return
  }

  const isBackgroundUrlAllowedElement = isBackgroundUrlAllowed(model)

  if (isBackgroundUrlAllowedElement) {
    // @ts-ignore
    model.setAttributes({
      // @ts-ignore
      ...model.getAttributes(),
      'background-url': url
    })
  }
}

export function getImage(model: Model): string {
  const isImageElement = isImage(model)

  if (isImageElement) {
    return model.get('src')
  }

  const isBackgroundImageAllowedElement = isBackgroundImageAllowed(model)

  if (isBackgroundImageAllowedElement) {
    const elementStyle = model.get('style')

    const bgImage: string = elementStyle['background-image']
    const matches = bgImage.match(/^url\((.+)\)$/)

    if (!matches) {
      return ''
    }

    return matches[1]
  }

  const isBackgroundUrlAllowedElement = isBackgroundUrlAllowed(model)

  if (isBackgroundUrlAllowedElement) {
    return model.get('background-url')
  }

  return ''
}
