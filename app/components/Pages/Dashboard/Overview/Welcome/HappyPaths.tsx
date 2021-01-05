import React from 'react'
import { Box, Typography } from '@material-ui/core'
import MuiLinearProgress from '@material-ui/core/LinearProgress'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'

const LinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[200]
    },
    bar: {
      borderRadius: 5,
      backgroundColor: theme.palette.grey[400]
    }
  })
)(MuiLinearProgress)

export default function HappyPaths() {
  return (
    <>
      <Box m={2}>
        <Typography variant="body2">Your progress:</Typography>
        <LinearProgress variant="determinate" value={50} />
      </Box>
    </>
  )
}
