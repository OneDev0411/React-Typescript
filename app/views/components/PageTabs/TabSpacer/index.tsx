import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  () =>
    createStyles({
      spacer: {
        display: 'flex',
        flexGrow: 1
      }
    }),
  {
    name: 'TabSpacer'
  }
)

export function TabSpacer() {
  const classes = useStyles()

  return <div className={classes.spacer} />
}
