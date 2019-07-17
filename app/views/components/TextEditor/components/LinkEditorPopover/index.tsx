import Draft, { EditorState } from 'draft-js'
import { getSelectionText } from 'draftjs-utils'
import { Box, Button, Grid, Popover, TextField } from '@material-ui/core'
import * as React from 'react'
import { RefObject, useEffect, useRef, useState } from 'react'
import { PopoverProps } from '@material-ui/core/Popover'
import usePrevious from 'react-use/esm/usePrevious'

interface Props {
  open: boolean
  onClose: () => void
  editorElementRef: RefObject<Element>
  editorState: EditorState
  setEditorState: (editorState: EditorState) => void
}

export function LinkEditorPopover({
  open,
  onClose,
  editorState,
  editorElementRef
}: Props) {
  const lastSelectionRect = useRef(Draft.getVisibleSelectionRect(window))

  const selectionRect = Draft.getVisibleSelectionRect(window)

  const [text, setText] = useState('')
  const [link, setLink] = useState('')

  if (selectionRect) {
    lastSelectionRect.current = selectionRect
  }

  let anchorPosition: PopoverProps['anchorPosition'] | undefined

  if (lastSelectionRect.current) {
    anchorPosition = {
      top: lastSelectionRect.current.top + lastSelectionRect.current.height,
      left: lastSelectionRect.current.left + lastSelectionRect.current.width / 2
    }
  }

  const wasOpen = usePrevious(open)

  useEffect(() => {
    if (open && !wasOpen) {
      setText(getSelectionText(editorState))
      setLink('') // TODO: set to selection text, if it's a valid link
    }
  }, [editorState, open, wasOpen])

  const applyLink = event => {
    if (link) {
      // TODO
      onClose()
    }

    event.stopPropagation()
  }

  return (
    <Popover
      open={open}
      onClose={onClose}
      onClick={stopPropagation} /* Popover closes without this */
      anchorReference={anchorPosition ? 'anchorPosition' : 'anchorEl'}
      anchorEl={editorElementRef.current}
      anchorPosition={anchorPosition}
    >
      {/*
      After a couple of back and forth, I decided not to use final form here
      because:
        - Fairly simple validation logic which is not subject to change in future
        - Need for control over the values from outside the form which will be hacky with final form
        - Don't want to show validation status and message an fields.
      */}
      <form onSubmit={applyLink} noValidate>
        <Box p={2}>
          <Grid container wrap="nowrap" alignItems="flex-end">
            <Grid container direction="column">
              <TextField
                label="Text"
                value={text}
                onChange={event => setText(event.target.value)}
                margin="dense"
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                value={link}
                onChange={event => setLink(event.target.value)}
                autoFocus
                placeholder="Paste a link"
                InputLabelProps={{
                  shrink: true
                }}
                required
                label="Link"
                margin="dense"
                variant="outlined"
              />
            </Grid>
            <Box marginLeft={2} marginBottom={0.6}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={!link}
              >
                Apply
              </Button>
            </Box>
          </Grid>
        </Box>
      </form>
    </Popover>
  )
}

const stopPropagation = event => event.stopPropagation()
