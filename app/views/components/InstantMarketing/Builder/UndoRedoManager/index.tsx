import React from 'react'
import { Box, Button, ButtonGroup } from '@material-ui/core'
import { Editor } from 'grapesjs'

import UndoIcon from 'components/SvgIcons/Undo/IconUndo'
import RedoIcon from 'components/SvgIcons/Redo/IconRedo'

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
          <RedoIcon />
          <Box ml={0.75} component="span">
            Redo
          </Box>
        </Button>
        <Button disabled={!hasUndo} variant="outlined" onClick={undo}>
          <UndoIcon />
          <Box ml={0.75} component="span">
            Undo
          </Box>
        </Button>
      </ButtonGroup>
    </Box>
  )
}
