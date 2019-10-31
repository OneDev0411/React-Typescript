import { ContentBlock } from 'draft-js'

import { getContentBlockSelector } from './get-content-block-selector'

export function getBlockElement(contentBlock: ContentBlock) {
  const blockElement = document.querySelector(
    getContentBlockSelector(contentBlock.getKey())
  )

  if (
    blockElement &&
    blockElement.firstElementChild === blockElement.lastElementChild
  ) {
    return blockElement.firstElementChild
  }

  return blockElement
}
