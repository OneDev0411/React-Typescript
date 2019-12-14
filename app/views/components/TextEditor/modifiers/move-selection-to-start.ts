import { EditorState, SelectionState } from 'draft-js'

export function moveSelectionToStart(editorState: EditorState): EditorState {
  const content = editorState.getCurrentContent()
  const firstBlock = content.getFirstBlock()
  const firstKey = firstBlock.getKey()

  return EditorState.acceptSelection(
    editorState,
    new SelectionState({
      anchorKey: firstKey,
      anchorOffset: 0,
      focusKey: firstKey,
      focusOffset: 0,
      isBackward: false
    })
  )
}
