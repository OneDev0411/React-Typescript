// @ts-nocheck
import React from 'react'
import { Link } from 'react-router'
import { withStyles } from '@material-ui/core'

import { Tab } from '../Tab'

export const TabLink = withStyles(theme => ({
  root: {
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.primary.main
    },
    '&:active, &:focus': {
      outline: 'none',
      textDecoration: 'none'
    }
  }
}))(props => <Tab {...props} component={Link} />)
