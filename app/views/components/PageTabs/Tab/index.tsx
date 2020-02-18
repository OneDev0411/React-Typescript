import React from 'react'
import { Tab as BaseTab, TabProps, withStyles } from '@material-ui/core'

export const Tab = withStyles(theme => ({
  root: {
    minWidth: theme.spacing(8),
    fontSize: theme.typography.subtitle1.fontSize,
    '&$selected': {
      fontWeight: 'bold'
    }
  }
}))((props: TabProps) => <BaseTab {...props} />)
