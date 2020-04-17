import React from 'react'
import { Tab as BaseTab, TabProps, withStyles } from '@material-ui/core'

export const Tab = withStyles(theme => ({
  root: {
    minWidth: 'unset',
    color: theme.palette.common.black,
    ...theme.typography.body1,
    zIndex: 1,
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  selected: {
    ...theme.typography.subtitle1,
    '& button[aria-controls="menu-list-grow"]': {
      ...theme.typography.subtitle1
    }
  },
  textColorPrimary: {
    '&$selected': {
      color: theme.palette.common.black
    }
  }
}))((props: TabProps) => <BaseTab {...props} />)
