import React from 'react'

import { Button } from '@material-ui/core'
import { mdiDraw } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
      startIcon={<SvgIcon path={mdiDraw} size={muiIconSizes.small} />}
      size="small"
      variant="outlined"
      color={isActive ? 'secondary' : 'default'}
      onClick={toggleDrawing}
    >
      Draw
    </Button>
  )
}
