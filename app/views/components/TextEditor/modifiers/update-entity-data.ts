import { EditorState } from 'draft-js'

import { getBlocksWhereEntityData } from '../utils/get-block-where-entity-data'

/**
 * Returns a new editorState in which the entity data is updated based on
 * `updates` only for the first block which has an entity at offset 0 that
 * matches with `isMatch`. Maybe reading the code is more descriptive!
 */
export function updateEntityData(
  imagePlugin,
  editorState: EditorState,
  isMatch: (entityData: any) => boolean,
  updates: StringMap<any>
): EditorState {
  // find image blocks with src equal to `oldUrl`
  const blocks = getBlocksWhereEntityData(editorState, isMatch)

  const key = blocks.first().get('key')

  const entityKey = editorState
    .getCurrentContent()
    .getBlockForKey(key)
    .getEntityAt(0)

  const newContent = editorState
    .getCurrentContent()
    .mergeEntityData(entityKey, updates)

  // This adds an image with src equal to newUrl
  return EditorState.set(editorState, {
    currentContent: newContent
  }) as EditorState
}
