import { ContentState, SelectionState } from 'draft-js'

export function isValidSelection(
  contentState: ContentState,
  selection: SelectionState
) {
  const startBlock = contentState.getBlockForKey(selection.getStartKey())
  const endBlock = contentState.getBlockForKey(selection.getEndKey())

  return (
    startBlock &&
    endBlock &&
    startBlock.getLength() >= selection.getStartOffset() &&
    endBlock.getLength() >= selection.getEndOffset()
  )
}
