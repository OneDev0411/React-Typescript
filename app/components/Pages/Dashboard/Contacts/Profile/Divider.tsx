import React from 'react'
import { Divider as MUIDivider } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    middle: {
      // marginLeft: theme.spacing(3),
      // marginRight: theme.spacing(3)
    }
  })
)

export default function Divider() {
  const classes = useStyles()

  return <MUIDivider variant="middle" className={classes.middle} />
}
