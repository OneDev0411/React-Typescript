import React from 'react'
import { Button } from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiFlipHorizontal } from '@mdi/js'

import { ImageEditor } from '../../types'

interface Props {
  editor: ImageEditor
}

export function Flip({ editor }: Props) {
  const flip = async () => {
    editor.stopDrawingMode()
    editor.flipX()
  }

  return (
    <Button
      startIcon={<Icon path={mdiFlipHorizontal} size={1} />}
      size="small"
      variant="outlined"
      onClick={flip}
    >
      Flip
    </Button>
  )
}
