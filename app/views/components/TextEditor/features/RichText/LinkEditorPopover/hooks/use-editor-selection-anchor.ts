import { RefObject, useState } from 'react'

import Draft, { Editor, EditorState } from 'draft-js'

import { ReferenceObject } from '../../../../types'

import { useOnToggledOn } from './use-on-toggled'

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

      // TODO: handle atomic block selection too
      const visibleSelectionRect = Draft.getVisibleSelectionRect(window)
      const selectionContainerElement = editorRef.current!.editor.querySelector(
        `[data-offset-key="${selection.getAnchorKey()}-0-0"]`
      )

      if (selectionContainerElement && visibleSelectionRect) {
        const selectionContainerBBox =
          selectionContainerElement.getBoundingClientRect()
        const leftOffset =
          visibleSelectionRect.left - selectionContainerBBox.left
        const left = selectionContainerBBox.left + leftOffset
        const topOffset = visibleSelectionRect.top - selectionContainerBBox.top

        setAnchorEl({
          clientWidth: 10,
          clientHeight: 10,
          getBoundingClientRect: () => {
            const selectionContainerBBox =
              selectionContainerElement.getBoundingClientRect()

            const top = selectionContainerBBox.top + topOffset

            const width = visibleSelectionRect.height
            const height = visibleSelectionRect.height

            return new DOMRect(left, top, width, height)
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
    getBoundingClientRect() {
      const boundingClientRect = editorElement.getBoundingClientRect()
      const left = boundingClientRect.left
      const top = boundingClientRect.top
      const height = 20
      const width = 10

      return new DOMRect(left, top, width, height)
    }
  }
}
