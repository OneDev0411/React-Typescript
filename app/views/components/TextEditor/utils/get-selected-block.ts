import { ContentBlock, EditorState } from 'draft-js'
import { getSelectedBlocksList } from 'draftjs-utils'
import { List } from 'immutable'

export function getSelectedBlock(
  editorState: EditorState
): ContentBlock | undefined {
  const selectedBlocksList: List<ContentBlock> = getSelectedBlocksList(
    editorState
  )

  return selectedBlocksList.size === 1 ? selectedBlocksList.get(0) : undefined
}
