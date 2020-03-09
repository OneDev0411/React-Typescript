import React from 'react'
import { Tab as BaseTab, TabProps, withStyles } from '@material-ui/core'

export const Tab = withStyles(theme => ({
  root: {
    minWidth: theme.spacing(8),
    color: theme.palette.common.black,
    ...theme.typography.body1,
    '&.Mui-selected': {
      ...theme.typography.subtitle1,
      fontWeight: 'bold'
    }
  }
}))((props: TabProps) => <BaseTab {...props} />)
