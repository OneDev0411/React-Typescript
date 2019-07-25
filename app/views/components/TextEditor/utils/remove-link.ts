import { EditorState, RichUtils, SelectionState } from 'draft-js'

import {
  getEntityRange,
  getSelectionEntity,
  getSelectionInlineStyle
} from 'draftjs-utils'

export function removeLink(editorState: EditorState) {
  const entityKey = getSelectionEntity(editorState)

  if (entityKey) {
    const entityRange = getEntityRange(editorState, entityKey)

    const selection = editorState.getSelection()

    let newEditorState = RichUtils.toggleLink(
      editorState,
      selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end
      }) as SelectionState,

      null
    )

    if (getSelectionInlineStyle(newEditorState).UNDERLINE) {
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE')
    }

    newEditorState = EditorState.set(newEditorState, {
      selection
    })

    return newEditorState
  }
}
