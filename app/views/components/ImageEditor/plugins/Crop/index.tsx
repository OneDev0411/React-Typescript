import React from 'react'
import Icon from '@mdi/react'
import { mdiCrop } from '@mdi/js'
import { useEffectOnce } from 'react-use'

import { Button } from '@material-ui/core'

import { ImageEditor, ObjectActivatedData, Actions } from '../../types'

interface Props {
  editor: ImageEditor
  isActive: boolean
  width: number
  height: number
  onChangeActiveAction: (action: Actions | null) => void
}

export function Crop({
  editor,
  isActive,
  width,
  height,
  onChangeActiveAction
}: Props) {
  useEffectOnce(() => {
    const onObjectActivated = (data: ObjectActivatedData) => {
      if (
        data.type === 'cropzone' &&
        (data.width / data.height).toFixed(2) !== (width / height).toFixed(2)
      ) {
        editor.setCropzoneRect(width / height)
      }
    }

    editor.on('objectActivated', onObjectActivated)

    return () => {
      editor.off('objectActivated')
    }
  })

  const toggleCropping = async () => {
    if (isActive) {
      editor.stopDrawingMode()
      onChangeActiveAction(null)

      return
    }

    editor.startDrawingMode('CROPPER')
    editor.setCropzoneRect(width / height)

    onChangeActiveAction('crop')
  }

  return (
    <Button
      startIcon={<Icon path={mdiCrop} size={1} />}
      color={isActive ? 'secondary' : 'default'}
      onClick={toggleCropping}
    >
      Crop
    </Button>
  )
}
