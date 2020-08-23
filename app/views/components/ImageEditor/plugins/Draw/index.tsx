import React from 'react'
import Icon from '@mdi/react'
import { mdiDraw } from '@mdi/js'

import { Button } from '@material-ui/core'

import { ImageEditor, Actions } from '../../types'

interface Props {
  editor: ImageEditor
  isActive: boolean
  onChangeActiveAction: (action: Actions | null) => void
}

export function Draw({ editor, onChangeActiveAction, isActive }: Props) {
  const toggleDrawing = () => {
    if (isActive) {
      editor.stopDrawingMode()
      onChangeActiveAction(null)

      return
    }

    editor.startDrawingMode('FREE_DRAWING')
    onChangeActiveAction('draw')
  }

  return (
    <Button
      startIcon={<Icon path={mdiDraw} size={1} />}
      color={isActive ? 'secondary' : 'default'}
      onClick={toggleDrawing}
    >
      Draw
    </Button>
  )
}
