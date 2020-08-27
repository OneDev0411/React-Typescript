import React from 'react'
import { Button } from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiImageFilterBlackWhite } from '@mdi/js'

import { ImageEditor, Actions } from '../../types'

interface Props {
  editor: ImageEditor
  isActive: boolean
  onChangeActiveAction: (action: Actions | null) => void
}

export function Filters({ editor, isActive, onChangeActiveAction }: Props) {
  const toggleFilters = async () => {
    if (isActive) {
      onChangeActiveAction(null)

      return
    }

    editor.stopDrawingMode()
    onChangeActiveAction('filter')
  }

  return (
    <Button
      startIcon={<Icon path={mdiImageFilterBlackWhite} size={1} />}
      size="small"
      variant="outlined"
      color={isActive ? 'secondary' : 'default'}
      onClick={toggleFilters}
    >
      Filters
    </Button>
  )
}
