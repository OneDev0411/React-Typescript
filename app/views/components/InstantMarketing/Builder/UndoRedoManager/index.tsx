import React from 'react'
import { Tooltip, IconButton } from '@material-ui/core'
import { Editor } from 'grapesjs'
import { useTheme } from '@material-ui/core/styles'

import { mdiUndoVariant } from '@mdi/js'
import Icon from '@mdi/react'

import { mdiRedoVariant } from '@mdi/js'

import useUndoRedo from './use-undo-redo'

interface Props {
  editor: Editor
}

export default function UndoRedoManager({ editor }: Props) {
  const { hasUndo, hasRedo, undo, redo } = useUndoRedo(editor)
  const theme = useTheme()

  return (
    <>
      <Tooltip title="Undo">
        <div>
          <IconButton disabled={!hasUndo} onClick={undo}>
            <Icon
              path={mdiUndoVariant}
              size={1}
              color={
                hasUndo
                  ? theme.palette.common.black
                  : theme.palette.action.disabled
              }
            />
          </IconButton>
        </div>
      </Tooltip>
      <Tooltip title="Redo">
        <div>
          <IconButton disabled={!hasRedo} onClick={redo}>
            <Icon
              path={mdiRedoVariant}
              size={1}
              color={
                hasRedo
                  ? theme.palette.common.black
                  : theme.palette.action.disabled
              }
            />
          </IconButton>
        </div>
      </Tooltip>
    </>
  )
}
