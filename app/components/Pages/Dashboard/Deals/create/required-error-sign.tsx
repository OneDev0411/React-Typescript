import React from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'inline-flex',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      width: theme.spacing(10),
      height: theme.spacing(3.4),
      backgroundColor: theme.palette.error.main,
      position: 'relative',
      color: theme.palette.common.white,
      fontSize: theme.spacing(1.75),
      lineHeight: 1,
      marginLeft: theme.spacing(2),
      borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`
    },
    arrowLeft: {
      width: 0,
      height: 0,
      borderTop: `${theme.spacing(1.7)}px solid transparent`,
      borderBottom: `${theme.spacing(1.7)}px solid transparent`,
      borderRight: `${theme.spacing(1.7)}px solid ${theme.palette.error.main}`,
      position: 'absolute',
      left: theme.spacing(-1.7),
      top: 0
    }
  }),
  { name: 'RequiredErrorSign' }
)
export default function RequiredErrorSign() {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <Box display="flex" alignItems="center">
        Required
      </Box>
      <div className={classes.arrowLeft} />
    </Box>
  )
}
