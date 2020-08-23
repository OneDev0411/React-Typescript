import React from 'react'
import { Button } from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiFormatTextbox } from '@mdi/js'

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
      startIcon={<Icon path={mdiFormatTextbox} size={1} />}
      color={isActive ? 'secondary' : 'default'}
      onClick={toggleCreateText}
    >
      Add Text
    </Button>
  )
}
