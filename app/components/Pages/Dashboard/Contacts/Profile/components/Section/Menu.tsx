import React from 'react'
import { Box, IconButton, Tooltip } from '@material-ui/core'

import IconCog from 'components/SvgIcons/Cog/IconCog'
import IconEdit from 'components/SvgIcons/Edit/EditIcon'

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
        <IconButton onClick={onEdit}>
          <IconEdit className="menu__icon" />
        </IconButton>
      )}
      {setting && (
        <Tooltip title={setting.tooltip}>
          <IconButton href={setting.href}>
            <IconCog className="menu__icon" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}
