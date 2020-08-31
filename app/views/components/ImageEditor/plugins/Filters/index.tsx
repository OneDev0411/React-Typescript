import React from 'react'
import { Button } from '@material-ui/core'
import { mdiImageFilterBlackWhite } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

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
      startIcon={
        <SvgIcon path={mdiImageFilterBlackWhite} size={muiIconSizes.small} />
      }
      size="small"
      variant="outlined"
      color={isActive ? 'secondary' : 'default'}
      onClick={toggleFilters}
    >
      Filters
    </Button>
  )
}
