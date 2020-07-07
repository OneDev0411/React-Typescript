import React from 'react'
import { Box, IconButton, Tooltip } from '@material-ui/core'

import { mdiCog, mdiPencilOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

interface Props {
  onEdit?: () => void
  setting?: {
    tooltip: string
    href: string
  }
}

export function Menu({ onEdit, setting }: Props) {
  return (
    <Box>
      {onEdit && (
        <Tooltip title="Edit">
          <IconButton onClick={onEdit}>
            <SvgIcon
              size={muiIconSizes.small}
              path={mdiPencilOutline}
              className="menu__icon"
            />
          </IconButton>
        </Tooltip>
      )}
      {setting && (
        <Tooltip title={setting.tooltip}>
          <IconButton href={setting.href}>
            <SvgIcon
              size={muiIconSizes.small}
              path={mdiCog}
              className="menu__icon"
            />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}
