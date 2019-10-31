import { ContentBlock, ContentState } from 'draft-js'

/**
 * it's convenient to store atomic block metadata in an entity which is
 * associated with the first character of the block (which is usually a dummy
 * character itself)
 *
 * This function returns the entity data stored for the first character
 * of the contentBlock. Though it technically doesn't need the block to
 * be an `atomic` block, it's normally used for atomic blocks such as images
 */
export function getAtomicBlockEntityData(
  contentState: ContentState,
  contentBlock: ContentBlock
): Record<string, any> | null {
  const entityKey = contentBlock.getEntityAt(0)

  if (entityKey) {
    const entity = contentState.getEntity(entityKey)

    if (entity) {
      return entity.getData()
    }
  }

  return null
}
