import React from 'react'
import { Tooltip, IconButton } from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  onClick: () => void
}

export default function Dismiss({ onClick }: Props) {
  return (
    <Tooltip title="Dismiss">
      <IconButton aria-label="dismiss" color="secondary" onClick={onClick}>
        <SvgIcon path={mdiClose} />
      </IconButton>
    </Tooltip>
  )
}
