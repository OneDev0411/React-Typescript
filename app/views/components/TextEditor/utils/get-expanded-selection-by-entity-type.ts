import { EditorState, SelectionState } from 'draft-js'

import { getEntitiesInSelection } from './get-entities-in-selection'

export function getExpandedSelectionByEntityType(
  editorState: EditorState,
  entityType: string
) {
  const entities = getEntitiesInSelection(editorState, entityType)

  const currentSelection = editorState.getSelection()

  return entities.reduce(
    (selection, entity) =>
      selection.merge({
        isBackward: false,
        hasFocus: false,
        anchorOffset: Math.min(
          selection.getAnchorOffset(),
          selection.getFocusOffset(),
          entity.start
        ),
        focusOffset: Math.max(
          selection.getFocusOffset(),
          selection.getAnchorOffset(),
          entity.end
        )
      }) as SelectionState,
    currentSelection
  )
}
