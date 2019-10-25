import React, { EventHandler, ReactNode } from 'react'
import { Box, Divider, IconButton, Typography } from '@material-ui/core'

import CloseIcon from '../SvgIcons/Close/CloseIcon'

interface Props {
  children: ReactNode
  onClose: EventHandler<React.MouseEvent>
}

export function DialogTitle({ children, onClose }: Props) {
  return (
    <>
      <Box display="flex" alignItems="center" px={3} py={1}>
        <Box flex={1}>
          <Typography variant="h6" noWrap>
            {children}
          </Typography>
        </Box>
        {onClose && (
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
    </>
  )
}
