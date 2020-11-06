import React from 'react'
import { Button } from '@material-ui/core'

import { mdiCheckOutline, mdiCancel } from '@mdi/js'

import { useEffectOnce } from 'react-use'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

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
        startIcon={<SvgIcon path={mdiCheckOutline} size={muiIconSizes.small} />}
        onClick={crop}
      >
        Apply
      </Button>

      <Button
        startIcon={<SvgIcon path={mdiCancel} size={muiIconSizes.small} />}
        onClick={cancel}
      >
        Cancel
      </Button>
    </div>
  )
}
