import React from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiShape } from '@mdi/js'

import { ImageEditor, Actions } from '../../types'

interface Props {
  editor: ImageEditor
  isActive: boolean
  onChangeActiveAction: (action: Actions | null) => void
}

export function Shape({ editor }: Props) {
  const handleCreateShape = async () => {}

  return (
    <Tooltip title="Shape">
      <span>
        <IconButton size="small" onClick={handleCreateShape}>
          <Icon path={mdiShape} size={1.5} color="#262626" />
        </IconButton>
      </span>
    </Tooltip>
  )
}
