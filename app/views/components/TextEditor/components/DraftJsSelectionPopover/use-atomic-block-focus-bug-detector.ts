import { ContentBlock, EditorState } from 'draft-js'
import { useEffect, useState } from 'react'

import { getContentBlockSelector } from '../../utils/get-content-block-selector'

/**
 * When the editor loses focus while an atomic block is selected, the
 * selection state still returns true for getHasFocus() which is god damn
 * wrong! This hook, accepts the editorState and a block and checks if it's
 * really selected, based on document.getSelection API. It's not so clean,
 * but that works as a workaround.
 */
export function useAtomicBlockFocusBugDetector(
  focusedBlock: ContentBlock | undefined,
  editorState: EditorState
) {
  const [isReallyFocused, setIsReallyFocused] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      let node: undefined | null | Node

      if (focusedBlock) {
        const editorSelection = editorState.getSelection()

        const selection = document.getSelection()
        const focusNode = selection && selection.focusNode

        const selectedBlockKey = focusedBlock.getKey()

        if (
          selectedBlockKey === editorSelection.getFocusKey() &&
          editorSelection.getHasFocus() &&
          focusNode
        ) {
          node = focusNode

          const contentBlockSelector = getContentBlockSelector(selectedBlockKey)

          while (
            node &&
            (!(node instanceof HTMLElement) ||
              !node.matches(contentBlockSelector))
          ) {
            node = node.parentNode
          }
        }
        // Note that if the selection doesn't have a focusNode, we assume the
        // block is remained selected. This is important
      }

      setIsReallyFocused(node !== null)
    })
  }, [editorState, focusedBlock])

  return isReallyFocused
}
