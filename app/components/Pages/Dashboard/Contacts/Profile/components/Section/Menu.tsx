import React from 'react'
import { Box, Button, IconButton, Tooltip } from '@material-ui/core'

import IconCog from 'components/SvgIcons/Cog/IconCog'

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
        <Button onClick={onEdit} color="secondary" size="small">
          Update
        </Button>
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
