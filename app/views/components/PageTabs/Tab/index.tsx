import React from 'react'
import { Tab as BaseTab, TabProps, withStyles } from '@material-ui/core'

export const Tab = withStyles(theme => ({
  root: {
    minWidth: theme.spacing(8),
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight
  }
}))((props: TabProps) => <BaseTab {...props} />)
