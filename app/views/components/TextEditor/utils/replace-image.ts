import Draft, { EditorState } from 'draft-js'

import { getBlocksWhereEntityData } from './get-block-where-entity-data'

/**
 * Returns a new editorState in which the image with src `oldUrl` is replaced
 * with a new images with src `newUrl`.
 *
 */
export function replaceImage(
  imagePlugin,
  editorState: EditorState,
  oldUrl: string,
  newUrl: string
): EditorState {
  // find image blocks with src equal to `oldUrl`
  const blocks = getBlocksWhereEntityData(
    editorState,
    data => data.src === oldUrl
  )

  const key = blocks.first().get('key')

  // TODO: a better approach is to update src in the old contentBlock,
  // rather than removing it (by selecting it and then adding image which
  // will replace it. This way, other states of the image is preserved

  // select the image to make the subsequent imagePlugin.addImage replace it.
  const newState = EditorState.acceptSelection(
    editorState,
    Draft.SelectionState.createEmpty(key)
  )

  // This adds an image with src equal to newUrl
  return imagePlugin.addImage(newState, newUrl)
}
