import React from 'react'
import { Box, LinearProgress } from '@material-ui/core'

import { useStyles } from '../../../styles'

interface Props {
  value: number | undefined
}

export default function UploadProgessBar({ value }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.uploadProgressbar}>
      <LinearProgress variant="determinate" value={value} />
    </Box>
  )
}
