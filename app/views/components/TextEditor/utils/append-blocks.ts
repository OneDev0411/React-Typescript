import { ContentBlock, ContentState, EditorState, Modifier } from 'draft-js'

export function appendBlocks(
  editorState: EditorState,
  blocks: ContentBlock[]
): EditorState {
  return EditorState.push(
    editorState,
    Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      EditorState.moveSelectionToEnd(editorState).getSelection(),
      ContentState.createFromBlockArray(blocks).getBlockMap()
    ),
    'insert-fragment'
  )
}
