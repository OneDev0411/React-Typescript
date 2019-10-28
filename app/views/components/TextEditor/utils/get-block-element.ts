import { ContentBlock } from 'draft-js'

export function getBlockElement(contentBlock: ContentBlock) {
  const blockElement = document.querySelector(
    `[data-offset-key="${contentBlock.getKey()}-0-0"]`
  )

  if (
    blockElement &&
    blockElement.firstElementChild === blockElement.lastElementChild
  ) {
    return blockElement.firstElementChild
  }

  return blockElement
}
