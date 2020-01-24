import React from 'react'
import { Tab as BaseTab, withStyles } from '@material-ui/core'

export const Tab = withStyles(theme => ({
  root: {
    minWidth: theme.spacing(8),
    fontSize: theme.typography.subtitle1.fontSize,
    '&$selected': {
      fontWeight: 'bold'
    }
  },
  selected: {}
}))(props => <BaseTab disableRipple {...props} />)
