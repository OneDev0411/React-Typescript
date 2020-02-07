import React from 'react'
import {
  Tab as BaseTab,
  TabProps,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: theme.spacing(8),
      fontSize: theme.typography.subtitle1.fontSize,
      '&$selected': {
        fontWeight: 'bold'
      }
    }
  })
)

export const Tab = (props: TabProps) => {
  const classes = useStyles()

  return <BaseTab {...props} className={classes.root} />
}
