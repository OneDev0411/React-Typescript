import { EditorState, RichUtils, SelectionState } from 'draft-js'
import {
  getEntityRange,
  getSelectionEntity,
  getSelectionInlineStyle,
  setBlockData
} from 'draftjs-utils'

import { getSelectedAtomicBlock } from './get-selected-atomic-block'

export function removeLink(editorState: EditorState): EditorState {
  const entityKey = getSelectionEntity(editorState)

  const entity =
    entityKey && editorState.getCurrentContent().getEntity(entityKey)

  const selectedBlock = getSelectedAtomicBlock(editorState)

  if (entity && entity.getType() === 'LINK') {
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

  if (selectedBlock) {
    const data = selectedBlock.getData()

    const href = data.get('href')

    if (href) {
      return setBlockData(editorState, {
        href: undefined,
        tooltip: undefined
      })
    }
  }

  return editorState
}
