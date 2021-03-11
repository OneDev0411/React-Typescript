import React, { ReactNode } from 'react'
import { Box, Typography } from '@material-ui/core'

import useStyles from './styles'

interface BoxWithTitleProps {
  title: string
  hasTitleBullet?: boolean
  children: ReactNode
}

function BoxWithTitle({
  title,
  children,
  hasTitleBullet = false
}: BoxWithTitleProps) {
  const classes = useStyles()

  return (
    <Box mb={5}>
      <Box mb={2}>
        <Typography variant="h5">
          {hasTitleBullet && <span className={classes.bullet} />}
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  )
}

export default BoxWithTitle
