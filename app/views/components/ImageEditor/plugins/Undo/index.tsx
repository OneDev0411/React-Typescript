import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiUndoVariant } from '@mdi/js'
import { useEffectOnce } from 'react-use'

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
      startIcon={<Icon path={mdiUndoVariant} size={1} />}
      disabled={isDisabled}
      onClick={() => editor.undo()}
    >
      Undo
    </Button>
  )
}
