import React, { useState } from 'react'

import { Button } from '@material-ui/core'
import { mdiRedoVariant } from '@mdi/js'
import { useEffectOnce } from 'react-use'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
      startIcon={<SvgIcon path={mdiRedoVariant} size={muiIconSizes.small} />}
      disabled={isDisabled}
      onClick={() => editor.redo()}
    >
      Redo
    </Button>
  )
}
