import React from 'react'
import { Tooltip, IconButton } from '@material-ui/core'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

interface Props {
  onClick: () => void
}

export default function Dismiss({ onClick }: Props) {
  return (
    <Tooltip title="Dismiss">
      <IconButton aria-label="dismiss" color="secondary" onClick={onClick}>
        <CloseIcon />
      </IconButton>
    </Tooltip>
  )
}
