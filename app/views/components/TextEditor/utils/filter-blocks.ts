import { EditorState, ContentBlock, ContentState } from 'draft-js'

export function filterBlocks(
  editorState: EditorState,
  filter: (block: ContentBlock) => any
): EditorState {
  const contentState = editorState.getCurrentContent()
  const blocks = contentState.getBlocksAsArray()
  const filteredBlocks = blocks.filter(filter)
  const filteredContentState = ContentState.createFromBlockArray(filteredBlocks)
  const filteredEditorState = EditorState.set(editorState, {
    currentContent: filteredContentState
  })

  return filteredEditorState
}
