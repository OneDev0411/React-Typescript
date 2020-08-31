import React from 'react'
import { Button } from '@material-ui/core'
import { mdiFormatTextbox } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { ImageEditor, Actions } from '../../types'

interface Props {
  editor: ImageEditor
  isActive: boolean
  onChangeActiveAction: (action: Actions | null) => void
}

export function Text({ editor, isActive, onChangeActiveAction }: Props) {
  const toggleCreateText = async () => {
    if (editor.getDrawingMode() !== 'TEXT') {
      editor.stopDrawingMode()
      editor.startDrawingMode('TEXT')

      onChangeActiveAction('text')

      return
    }

    editor.stopDrawingMode()
    onChangeActiveAction(null)
  }

  return (
    <Button
      startIcon={<SvgIcon path={mdiFormatTextbox} size={muiIconSizes.small} />}
      size="small"
      variant="outlined"
      color={isActive ? 'secondary' : 'default'}
      onClick={toggleCreateText}
    >
      Text
    </Button>
  )
}
