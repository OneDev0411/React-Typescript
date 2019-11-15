import {
  DraftHandleValue,
  EditorState,
  Modifier,
  SelectionState
} from 'draft-js'

import { getExpressionInOffset } from './utils/get-expression-in-offset'

export function insertTextOutsideExpressions(
  editorState: EditorState,
  setEditorState: (editorState: EditorState) => void,
  text: string
): DraftHandleValue {
  const selection = editorState.getSelection()

  /**
   * If selection is collapsed (nothing is selected) and the cursor
   * is for any reason within an occurrence of the expression, we prevent
   * the insertion and push the inserted character to after the expression,
   * to ensure the expression is atomic.
   */
  if (selection.isCollapsed()) {
    const offset = selection.getAnchorOffset()
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getFocusKey())
    const expressionInOffset = getExpressionInOffset(block, offset)
    const normalizedOffset = expressionInOffset ? expressionInOffset.to : offset

    if (normalizedOffset !== offset) {
      const newContentState = Modifier.insertText(
        editorState.getCurrentContent(),
        selection.merge({
          anchorOffset: normalizedOffset,
          focusOffset: normalizedOffset
        }) as SelectionState,
        text
      )

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'insert-characters'
      )

      setEditorState(newEditorState)

      return 'handled'
    }
  }

  return 'not-handled'
}
