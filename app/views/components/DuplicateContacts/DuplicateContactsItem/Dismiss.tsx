import React from 'react'
import { Tooltip } from '@material-ui/core'

import IconButton from 'components/Button/IconButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

interface Props {
  onClick: () => void
}

export default function Dismiss({ onClick }: Props) {
  return (
    <Tooltip title="Dismiss">
      <IconButton isFit inverse appearance="icon" onClick={onClick}>
        <CloseIcon />
      </IconButton>
    </Tooltip>
  )
}
