import { RefObject, useState } from 'react'
import Draft, { Editor, EditorState } from 'draft-js'

import { useOnToggledOn } from './use-on-toggled'
import { ReferenceObject } from '../../../types'

export function useEditorSelectionAnchor(
  open: boolean,
  editorState: EditorState,
  setEditorState: (editorState: EditorState) => void,
  editorRef: RefObject<Editor>
): ReferenceObject | null {
  const [anchorEl, setAnchorEl] = useState<ReferenceObject | null>(
    getEditorStartAnchor(editorRef.current && editorRef.current.editor)
  )

  useOnToggledOn(open, () => {
    const selection = editorState.getSelection()
    const newEditorState = EditorState.forceSelection(editorState, selection)

    setAnchorEl(null)
    // Set selection back if focus is lost
    setTimeout(() => {
      setEditorState(newEditorState)

      const visibleSelectionRect = Draft.getVisibleSelectionRect(window)
      const selectionContainerElement = editorRef.current!.editor.querySelector(
        `[data-offset-key="${selection.getAnchorKey()}-0-0"]`
      )

      if (selectionContainerElement && visibleSelectionRect) {
        const selectionContainerBBox = selectionContainerElement.getBoundingClientRect()
        const leftOffset =
          visibleSelectionRect.left - selectionContainerBBox.left
        const left = selectionContainerBBox.left + leftOffset
        const topOffset = visibleSelectionRect.top - selectionContainerBBox.top

        setAnchorEl({
          clientWidth: 10,
          clientHeight: 10,
          getBoundingClientRect: () => {
            const selectionContainerBBox = selectionContainerElement.getBoundingClientRect()

            const top = selectionContainerBBox.top + topOffset

            return {
              x: left,
              y: top,
              top,
              left,
              bottom: top + visibleSelectionRect.height,
              right: left + visibleSelectionRect.width,
              height: visibleSelectionRect.height,
              width: visibleSelectionRect.width
            }
          }
        })
      } else {
        setAnchorEl(getEditorStartAnchor(editorRef.current!.editor))
      }
    })
  })

  return anchorEl
}

function getEditorStartAnchor(
  editorElement: HTMLElement | null
): ReferenceObject | null {
  if (!editorElement) {
    return null
  }

  return {
    clientHeight: 20,
    clientWidth: 10,
    getBoundingClientRect(): ClientRect {
      const boundingClientRect = editorElement.getBoundingClientRect()
      const left = boundingClientRect.left
      const top = boundingClientRect.top
      const height = 20
      const width = 10

      return {
        width,
        height,
        left,
        top,
        right: left + width,
        bottom: top + height
      }
    }
  }
}
