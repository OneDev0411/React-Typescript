import { ContentBlock } from 'draft-js'

export function blockEquals(
  firstBlock: ContentBlock,
  secondBlock: ContentBlock | undefined
): boolean {
  if (!secondBlock) {
    return false
  }

  return firstBlock.getKey() === secondBlock.getKey()
}
