import React from 'react'
import { Tooltip, IconButton } from '@material-ui/core'
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
    <>
      <Tooltip title="Redo">
        <IconButton disabled={!hasRedo} onClick={redo}>
          <RedoIcon
            fillColor={
              hasRedo
                ? theme.palette.common.black
                : theme.palette.action.disabled
            }
          />
        </IconButton>
      </Tooltip>

      <Tooltip title="Undo">
        <IconButton disabled={!hasUndo} onClick={undo}>
          <UndoIcon
            fillColor={
              hasUndo
                ? theme.palette.common.black
                : theme.palette.action.disabled
            }
          />
        </IconButton>
      </Tooltip>
    </>
  )
}
