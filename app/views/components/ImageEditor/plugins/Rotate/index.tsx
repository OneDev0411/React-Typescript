import React from 'react'
import { Button } from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiRotateLeft } from '@mdi/js'

import { ImageEditor } from '../../types'

interface Props {
  editor: ImageEditor
  onRotate: () => void
}

export function Rotate({ editor, onRotate }: Props) {
  const rotate = async () => {
    editor.stopDrawingMode()
    editor.rotate(-45)

    onRotate()
  }

  return (
    <Button startIcon={<Icon path={mdiRotateLeft} size={1} />} onClick={rotate}>
      Rotate
    </Button>
  )
}
