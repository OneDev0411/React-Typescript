import React from 'react'
import { Button } from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiCheckOutline, mdiCancel } from '@mdi/js'

import { useEffectOnce } from 'react-use'

import { ImageEditor, Actions } from '../../../types'

interface Props {
  editor: ImageEditor
  onChangeActiveAction: (action: Actions | null) => void
  onCrop: () => void
}

export function CropActions({ editor, onChangeActiveAction, onCrop }: Props) {
  const crop = async () => {
    onChangeActiveAction(null)

    await editor.crop(editor.getCropzoneRect())

    editor.stopDrawingMode()

    onCrop()
  }

  const cancel = () => {
    editor.stopDrawingMode()
    onChangeActiveAction(null)
  }

  useEffectOnce(() => {
    const capture = (event: KeyboardEvent) => {
      if (event.code === 'Enter') {
        event.stopPropagation()
        crop()
      }

      if (event.code === 'Escape') {
        cancel()
      }
    }

    document.addEventListener('keydown', capture)

    return () => {
      document.removeEventListener('keydown', capture)
    }
  })

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
