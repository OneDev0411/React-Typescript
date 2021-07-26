import React from 'react'

import { Button } from '@material-ui/core'
import { mdiFlipHorizontal } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { ImageEditor } from '../../types'

interface Props {
  editor: ImageEditor
}

export function Flip({ editor }: Props) {
  const flip = () => {
    editor.stopDrawingMode()
    editor.flipX()
  }

  return (
    <Button
      startIcon={<SvgIcon path={mdiFlipHorizontal} size={muiIconSizes.small} />}
      size="small"
      variant="outlined"
      onClick={flip}
    >
      Flip
    </Button>
  )
}
