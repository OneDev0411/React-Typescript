import React from 'react'
import { Tab as BaseTab, withStyles } from '@material-ui/core'

export const Tab = withStyles(theme => ({
  root: {
    minWidth: '4rem',
    fontSize: theme.spacing(2),
    '&$selected': {
      fontWeight: 'bold'
    }
  },
  selected: {}
}))(props => <BaseTab disableRipple {...props} />)
