import React from 'react'
import { Box, Typography } from '@material-ui/core'
import MuiLinearProgress from '@material-ui/core/LinearProgress'
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles
} from '@material-ui/core/styles'

interface Props {
  value: number
  determinate: boolean
}

const LinearProgress = withStyles((theme: Theme) => ({
  root: {
    height: 18,
    borderRadius: theme.shape.borderRadius
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[200]
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main
  }
}))(MuiLinearProgress)

const styles = makeStyles(
  (theme: Theme) => ({
    progressContainer: {
      display: 'flex',
      width: '100%'
    },
    progressPercentage: {
      width: '50px',
      textAlign: 'right'
    },
    progressBar: {
      flexGrow: 1
    }
  }),
  { name: 'progressBar' }
)

export function ProgressBar({ value, determinate = false }: Props) {
  const classes = styles()

  return (
    <Box className={classes.progressContainer}>
      <Box className={classes.progressBar}>
        <LinearProgress
          variant={determinate ? 'determinate' : 'indeterminate'}
          value={value}
        />
      </Box>
      <Box className={classes.progressPercentage}>
        <Typography variant="body2">{value}%</Typography>
      </Box>
    </Box>
  )
}
