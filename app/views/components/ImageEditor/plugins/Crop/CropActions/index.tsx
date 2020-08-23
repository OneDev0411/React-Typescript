import React from 'react'
import { Button } from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiCheckOutline, mdiCancel } from '@mdi/js'

import { ImageEditor, Actions } from '../../../types'

interface Props {
  editor: ImageEditor
  onChangeActiveAction: (action: Actions | null) => void
  onCrop: () => void
}

export function CropActions({ editor, onChangeActiveAction, onCrop }: Props) {
  const crop = async () => {
    await editor.crop(editor.getCropzoneRect())
    editor.stopDrawingMode()
    onCrop()
    onChangeActiveAction(null)
  }

  const cancel = () => {
    editor.stopDrawingMode()
    onChangeActiveAction(null)
  }

  return (
    <div>
      <Button
        startIcon={<Icon path={mdiCheckOutline} size={0.75} />}
        onClick={crop}
      >
        Apply
      </Button>

      <Button
        startIcon={<Icon path={mdiCancel} size={0.75} />}
        onClick={cancel}
      >
        Cancel
      </Button>
    </div>
  )
}
