import React, { useState } from 'react'

import Icon from '@mdi/react'
import { mdiDeleteOutline } from '@mdi/js'
import { useEffectOnce } from 'react-use'

import { Button } from '@material-ui/core'

import { ImageEditor } from '../../types'

interface Props {
  editor: ImageEditor
}

export function Delete({ editor }: Props) {
  const [isDisabled, setIsDisabled] = useState(true)

  useEffectOnce(() => {
    editor.on('undoStackChanged', (length: number) =>
      setIsDisabled(length === 0)
    )

    return () => {
      editor.off('undoStackChanged')
    }
  })

  const removeActiveObject = () => {
    try {
      editor.removeActiveObject()
    } catch (e) {}
  }

  return (
    <Button
      startIcon={<Icon path={mdiDeleteOutline} size={1} />}
      disabled={isDisabled}
      onClick={removeActiveObject}
    >
      Delete
    </Button>
  )
}
