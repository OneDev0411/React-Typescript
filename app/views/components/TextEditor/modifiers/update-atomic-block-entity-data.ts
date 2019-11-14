import { EditorState, ContentBlock } from 'draft-js'

/**
 * it's convenient to store atomic block metadata in an entity which is
 * associated with the first character of the block (which is usually a dummy
 * character itself). I think block data is better for this purpose but
 * the entity approach is used by some common plugins like alignment plugin,
 * image plugin and resize plugin.
 */
export function updateAtomicBlockEntityData(
  editorState: EditorState,
  contentBlock: ContentBlock,
  data: Record<string, any>
) {
  const entityKey = contentBlock.getEntityAt(0)

  if (entityKey) {
    const contentState = editorState.getCurrentContent()

    contentState.mergeEntityData(entityKey, { ...data })

    return EditorState.forceSelection(editorState, editorState.getSelection())
  }

  return editorState
}
