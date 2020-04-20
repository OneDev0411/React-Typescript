import React from 'react'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: theme.spacing(1.5),
      width: theme.spacing(2.5),
      height: theme.spacing(2.5),
      top: theme.spacing(1) * -1,
      right: theme.spacing(1) * -1,
      background: theme.palette.error.light,
      color: theme.palette.common.white,
      borderRadius: '100%',
      border: `2px solid ${theme.palette.common.white}`,
      zIndex: 1
    }
  }),
  {
    name: 'DealGridNotification'
  }
)

interface Props {
  count: number
}

export function Notification(props: Props) {
  const classes = useStyles()

  return <div className={classes.root}>{props.count}</div>
}
