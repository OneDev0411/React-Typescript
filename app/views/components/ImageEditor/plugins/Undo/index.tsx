import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { mdiUndoVariant } from '@mdi/js'
import { useEffectOnce } from 'react-use'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { ImageEditor } from '../../types'

interface Props {
  editor: ImageEditor
  onUndo: () => void
}

export function Undo({ editor, onUndo }: Props) {
  const [isDisabled, setIsDisabled] = useState(true)

  useEffectOnce(() => {
    editor.on('undoStackChanged', (length: number) => {
      setIsDisabled(length === 0)
      onUndo()
    })

    return () => {
      editor.off('undoStackChanged')
    }
  })

  return (
    <Button
      startIcon={<SvgIcon path={mdiUndoVariant} size={muiIconSizes.small} />}
      disabled={isDisabled}
      onClick={() => editor.undo()}
    >
      Undo
    </Button>
  )
}
