import React from 'react'
import { Button } from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiRotateLeft } from '@mdi/js'

import { ImageEditor, Actions } from '../../types'

interface Props {
  editor: ImageEditor
  isActive: boolean
  onChangeActiveAction: (action: Actions | null) => void
  onRotate: () => void
}

export function Rotate({
  editor,
  isActive,
  onChangeActiveAction,
  onRotate
}: Props) {
  const rotate = async () => {
    editor.stopDrawingMode()
    editor.rotate(-45)

    onRotate()
  }

  return (
    <Button
      startIcon={<Icon path={mdiRotateLeft} size={1} />}
      color={isActive ? 'secondary' : 'default'}
      onClick={rotate}
    >
      Rotate
    </Button>
  )
}
