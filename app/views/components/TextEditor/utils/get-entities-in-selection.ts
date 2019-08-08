import { EditorState } from 'draft-js'
import { getSelectedBlock } from 'draftjs-utils'

import { Entity } from '../types'

/**
 * Returns a list of entities (optionally filtered by entityType) within
 * the current block
 * @param editorState
 * @param entityType
 */
export function getEntitiesInSelection(
  editorState: EditorState,
  entityType?: string
) {
  const content = editorState.getCurrentContent()
  const entities: {
    entityKey: string
    entity: Entity
    start: number
    end: number
  }[] = []

  let selectedEntity: {
    entityKey: string
    entity: Entity
  }
  const selection = editorState.getSelection()

  const selectionStart = Math.min(
    selection.getFocusOffset(),
    selection.getAnchorOffset()
  )

  const selectionEnd = Math.max(
    selection.getFocusOffset(),
    selection.getAnchorOffset()
  )

  getSelectedBlock(editorState).findEntityRanges(
    character => {
      const entityKey = character.getEntity()

      if (entityKey !== null) {
        const entity = content.getEntity(entityKey)

        if (!entityType || (entityType && entity.getType() === entityType)) {
          selectedEntity = {
            entityKey,
            entity: content.getEntity(entityKey)
          }

          return true
        }
      }

      return false
    },
    (start, end) => {
      if (end >= selectionStart && start <= selectionEnd) {
        entities.push({ ...selectedEntity, start, end })
      }
    }
  )

  return entities
}
