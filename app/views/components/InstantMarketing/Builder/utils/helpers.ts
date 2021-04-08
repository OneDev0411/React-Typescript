import { Model } from 'backbone'

import { typeEmbedMap } from '../Blocks/Website/Map'
import { typeCarousel } from '../Blocks/Website/Carousel'

import {
  IMAGE_TOOLBAR_BUTTONS_PREFIX,
  IMAGE_ELEMENT_TYPES,
  BACKGROUND_IMAGE_ALLOWED_ELEMENT_TYPES,
  BACKGROUND_URL_ALLOWED_ELEMENT_TYPES,
  MAP_TOOLBAR_BUTTONS_PREFIX,
  CAROUSEL_TOOLBAR_BUTTONS_PREFIX
} from '../constants'

export function isImage(model: Model): boolean {
  const elementType = model.get('type') || model.get('tagName') || ''

  return IMAGE_ELEMENT_TYPES.includes(elementType)
}

export function isBackgroundImageAllowed(model: Model): boolean {
  const elementType = model.get('type') || model.get('tagName') || ''

  return BACKGROUND_IMAGE_ALLOWED_ELEMENT_TYPES.includes(elementType)
}

export function isBackgroundUrlAllowed(model: Model): boolean {
  const elementType = model.get('type') || model.get('tagName') || ''

  return BACKGROUND_URL_ALLOWED_ELEMENT_TYPES.includes(elementType)
}

function hasToolbarButtons(model: Model, prefix: string): boolean {
  const toolbar: any[] = model.get('toolbar')

  return toolbar.some(item => item.name && item.name.startsWith(prefix))
}

export function hasToolbarImageButtons(model: Model): boolean {
  return hasToolbarButtons(model, IMAGE_TOOLBAR_BUTTONS_PREFIX)
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
    // @ts-ignore
    const elementStyle = getComputedStyle(model.getEl())

    const bgImage = elementStyle.backgroundImage
    const matches = bgImage.match(/(?:\(['"]?)(.*?)(?:['"]?\))/)

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

export function isMap(model: Model): boolean {
  return model.get('type') === typeEmbedMap
}

export function hasToolbarMapButtons(model: Model): boolean {
  return hasToolbarButtons(model, MAP_TOOLBAR_BUTTONS_PREFIX)
}

export function isCarousel(model: Model): boolean {
  return model.get('type') === typeCarousel
}

export function hasToolbarCarouselButtons(model: Model): boolean {
  return hasToolbarButtons(model, CAROUSEL_TOOLBAR_BUTTONS_PREFIX)
}
