import React from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(0, 3, 0.5)
    }
  }),
  { name: 'ContactProfileBasicSection' }
)

export const BasicSection = ({ children }) => {
  const classes = useStyles()

  return <Box className={classes.container}> {children}</Box>
}
