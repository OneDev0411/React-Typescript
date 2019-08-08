import { SelectionState } from 'draft-js'

export function collapseSelection(selection: SelectionState) {
  return selection.merge({
    anchorOffset: selection.getFocusOffset(),
    anchorKey: selection.getFocusKey()
  }) as SelectionState
}
