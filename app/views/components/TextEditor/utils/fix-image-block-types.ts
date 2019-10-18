import { ContentBlock, ContentState } from 'draft-js'

export function fixImageBlockTypes(contentState: ContentState) {
  const blocks = contentState.getBlocksAsArray().map(block => {
    const entityKey = block.getEntityAt(0)

    const entity = entityKey != null && contentState.getEntity(entityKey)

    if (entity && entity.getType() === 'IMAGE') {
      return block.set('type', 'atomic') as ContentBlock
    }

    return block
  })

  return ContentState.createFromBlockArray(blocks, contentState.getEntityMap())
}
