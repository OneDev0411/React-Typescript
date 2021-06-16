import React from 'react'
import { IconButton } from '@material-ui/core'

import { mdiPencil } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

export function EditButton({ onClick }: Props) {
  return (
    <IconButton size="small" onClick={onClick}>
      <SvgIcon path={mdiPencil} size={muiIconSizes.small} />
    </IconButton>
  )
}
