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
    fontWeight: 'bold',
    '& button[aria-controls="menu-list-grow"]': {
      color: theme.palette.primary.main,
      '& svg': {
        fill: theme.palette.primary.main
      }
    }
  }
}))((props: TabProps) => <BaseTab {...props} />)
