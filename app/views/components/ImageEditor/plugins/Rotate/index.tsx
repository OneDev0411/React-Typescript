import React from 'react'
import { Button } from '@material-ui/core'
import { mdiRotateLeft } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { ImageEditor } from '../../types'

interface Props {
  editor: ImageEditor
  onRotate: () => void
}

export function Rotate({ editor, onRotate }: Props) {
  const rotate = async () => {
    editor.stopDrawingMode()
    editor.rotate(-90)

    onRotate()
  }

  return (
    <Button
      startIcon={<SvgIcon path={mdiRotateLeft} size={muiIconSizes.small} />}
      size="small"
      variant="outlined"
      onClick={rotate}
    >
      Rotate
    </Button>
  )
}
