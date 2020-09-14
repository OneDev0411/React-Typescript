import { EditorState, ContentBlock } from 'draft-js'

export function getLastAddedImageBlock(
  oldEditorState: EditorState,
  newEditorState: EditorState
): ContentBlock | undefined {
  const oldContent = oldEditorState.getCurrentContent()
  const oldBlocks = oldContent.getBlocksAsArray()
  const oldBlockKeys = oldBlocks.map(oldBlock => oldBlock.getKey())
  const newContent = newEditorState.getCurrentContent()
  const newBlocks = newContent.getBlocksAsArray()
  const newlyAddedImageBlocks = newBlocks.filter(
    newBlock =>
      !oldBlockKeys.includes(newBlock.getKey()) &&
      newBlock.getType() === 'atomic'
  )
  const lastAddedImageBlock =
    newlyAddedImageBlocks[newlyAddedImageBlocks.length - 1]

  return lastAddedImageBlock
}
