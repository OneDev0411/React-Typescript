import { ContentBlock, EditorState } from 'draft-js'
import { getSelectedBlocksList } from 'draftjs-utils'
import { List } from 'immutable'

export function getSelectedAtomicBlock(
  editorState: EditorState,
  ensureFocused = false
): ContentBlock | undefined {
  const selectedBlocksList: List<ContentBlock> = getSelectedBlocksList(
    editorState
  )

  const firstSelectedBlock = selectedBlocksList.get(0)

  return selectedBlocksList.size === 1 &&
    firstSelectedBlock.getType() === 'atomic' &&
    (!ensureFocused || editorState.getSelection().getHasFocus())
    ? firstSelectedBlock
    : undefined
}
