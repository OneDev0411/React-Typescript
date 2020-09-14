import { EditorState, DraftBlockType } from 'draft-js'

export function doesContainBlock(
  editorState: EditorState,
  blockKey: string,
  blockType?: DraftBlockType
): boolean {
  const content = editorState.getCurrentContent()
  const blocks = content.getBlocksAsArray()

  return blocks.some(
    block =>
      block.getKey() === blockKey &&
      (!blockType || block.getType() === blockType)
  )
}
