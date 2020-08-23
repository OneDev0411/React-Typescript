import React, { useState } from 'react'

import Icon from '@mdi/react'
import { mdiRedoVariant } from '@mdi/js'
import { useEffectOnce } from 'react-use'

import { Button } from '@material-ui/core'

import { ImageEditor } from '../../types'

interface Props {
  editor: ImageEditor
  onRedo: () => void
}

export function Redo({ editor, onRedo }: Props) {
  const [isDisabled, setIsDisabled] = useState(true)

  useEffectOnce(() => {
    editor.on('redoStackChanged', (length: number) => {
      setIsDisabled(length === 0)
      onRedo()
    })

    return () => {
      editor.off('redoStackChanged')
    }
  })

  return (
    <Button
      startIcon={<Icon path={mdiRedoVariant} size={1} />}
      disabled={isDisabled}
      onClick={() => editor.redo()}
    >
      Redo
    </Button>
  )
}
