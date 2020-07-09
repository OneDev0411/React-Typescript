import React from 'react'
import { Tooltip, IconButton } from '@material-ui/core'
import { Editor } from 'grapesjs'
import { useTheme } from '@material-ui/core/styles'

import { mdiUndoVariant, mdiRedoVariant } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
            <SvgIcon
              path={mdiUndoVariant}
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
            <SvgIcon
              path={mdiRedoVariant}
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
