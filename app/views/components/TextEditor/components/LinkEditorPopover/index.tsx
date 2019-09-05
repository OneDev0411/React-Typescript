import { Editor, EditorState } from 'draft-js'
import { ClickAwayListener, Popper, useTheme } from '@material-ui/core'
import * as React from 'react'
import { RefObject, useState } from 'react'
import { getSelectionText } from 'draftjs-utils'

import { useEditorSelectionAnchor } from './hooks/use-editor-selection-anchor'
import { useOnToggledOn } from './hooks/use-on-toggled'
import { createLink } from '../../utils/create-link'
import { getCurrentLinkUrl, stopPropagation } from './utils'
import { LinkEditorForm } from './components/LinkEditorForm'
import { getExpandedSelectionByEntityType } from '../../utils/get-expanded-selection-by-entity-type'

interface Props {
  open: boolean
  onClose: () => void
  editorRef: RefObject<Editor>
  editorState: EditorState
  setEditorState: (editorState: EditorState) => void
}

/**
 * Challenges in positioning:
 * - We want to position the overlay based on some selection which is not
 * necessarily a DOM node and we can't simply get it's bounding client rect.
 *  We can use selection client rect but as soon as focus is grabbed inside
 *  an input inside the overlay, we lost the selection and it breaks the
 *  positioning.
 * - We need to make sure positioning works no matter the there is an scrollable
 *   container or it's the window that scrolls.
 * - We can make the overlay portal or not.
 *   - Portal:
 *     - It makes positioning harder because we need to explicitly pass the
 *       scrollable container to ensure popover position is maintained
 *       correctly as the container scrolls
 *     - We have a jump on window scroll for some reason
 *   - Non-portal
 *     - We should watch out for issues like nested forms
 *     - It doesn't work when there is a relative ancestor (which is the case
 *       within the drawer)
 */
export function LinkEditorPopover({
  open,
  onClose,
  editorState,
  setEditorState,
  editorRef
}: Props) {
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const theme = useTheme()

  const anchorEl = useEditorSelectionAnchor(
    open,
    editorState,
    setEditorState,
    editorRef
  )

  useOnToggledOn(open, () => {
    const linkSelection = getExpandedSelectionByEntityType(editorState, 'LINK')

    let newEditorState = editorState

    if (linkSelection !== editorState.getSelection()) {
      newEditorState = EditorState.forceSelection(editorState, linkSelection)

      // without timeout, editorState will be overridden due to losing focus
      // to popover. There should be better ways, because this timeout is
      // kind of a workaround for this and also takes focus back again
      // from the popover which is not good.
      setTimeout(() => {
        setEditorState(newEditorState)
      })
    }

    setText(getSelectionText(newEditorState))
    setUrl(getCurrentLinkUrl(editorState) || '')
  })

  const applyLink = (text, url) => {
    setEditorState(createLink(editorState, url, text))
    onClose()
  }

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Popper
        style={{ zIndex: theme.zIndex.modal }}
        open={open && !!anchorEl}
        onClick={stopPropagation} /* Popover closes without this */
        anchorEl={anchorEl}
        transition
        placement="bottom-start"
      >
        {/*
      After a couple of back and forth, I decided not to use final form here
      because:
        - Fairly simple validation logic which is not subject to change in future
        - Need for control over the values from outside the form which will be hacky with final form
        - Don't want to show validation status and message an fields.
      */}
        <LinkEditorForm
          onKeyUp={e => {
            e.key === 'Escape' && onClose()
          }}
          onApply={applyLink}
          text={text}
          url={url}
          setText={setText}
          setUrl={setUrl}
        />
      </Popper>
    </ClickAwayListener>
  )
}
