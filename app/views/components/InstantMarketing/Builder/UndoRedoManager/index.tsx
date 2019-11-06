import React from 'react'
import { Box, Button, ButtonGroup } from '@material-ui/core'
import { Editor } from 'grapesjs'
import { useTheme } from '@material-ui/core/styles'

import UndoIcon from 'components/SvgIcons/Undo/IconUndo'
import RedoIcon from 'components/SvgIcons/Redo/IconRedo'

import useUndoRedo from './use-undo-redo'

interface Props {
  editor: Editor
}

export default function UndoRedoManager({ editor }: Props) {
  const { hasUndo, hasRedo, undo, redo } = useUndoRedo(editor)
  const theme = useTheme()

  return (
    <Box ml={2}>
      <ButtonGroup size="small">
        <Button disabled={!hasRedo} variant="outlined" onClick={redo}>
          <RedoIcon
            color={
              hasRedo
                ? theme.palette.common.black
                : theme.palette.action.disabled
            }
          />
          <Box ml={0.75} component="span">
            Redo
          </Box>
        </Button>
        <Button disabled={!hasUndo} variant="outlined" onClick={undo}>
          <UndoIcon
            color={
              hasUndo
                ? theme.palette.common.black
                : theme.palette.action.disabled
            }
          />
          <Box ml={0.75} component="span">
            Undo
          </Box>
        </Button>
      </ButtonGroup>
    </Box>
  )
}
