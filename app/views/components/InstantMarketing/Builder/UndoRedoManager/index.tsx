import React from 'react'
import { Box, Button, ButtonGroup } from '@material-ui/core'
import { Editor } from 'grapesjs'

import useUndoRedo from './use-undo-redo'

interface Props {
  editor: Editor
}

export default function UndoRedoManager({ editor }: Props) {
  const { hasUndo, hasRedo, undo, redo } = useUndoRedo(editor)

  return (
    <Box ml={2}>
      <ButtonGroup size="small">
        <Button disabled={!hasRedo} variant="outlined" onClick={redo}>
          Redo
        </Button>
        <Button disabled={!hasUndo} variant="outlined" onClick={undo}>
          Undo
        </Button>
      </ButtonGroup>
    </Box>
  )
}
