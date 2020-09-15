import React, { useState } from 'react'

import { mdiDeleteOutline } from '@mdi/js'
import { useEffectOnce } from 'react-use'

import { Button } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

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
      editor.off!('undoStackChanged')
    }
  })

  const removeActiveObject = () => {
    /**
     * TUI doesn't have any API to figure out there is a removable
     * object or not. so in this case clicking on remove object causes
     * unexpected error.
     */
    try {
      editor.removeActiveObject()
    } catch (e) {}
  }

  return (
    <Button
      startIcon={<SvgIcon path={mdiDeleteOutline} size={muiIconSizes.small} />}
      disabled={isDisabled}
      onClick={removeActiveObject}
    >
      Delete
    </Button>
  )
}
