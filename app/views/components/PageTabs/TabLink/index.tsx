import React from 'react'
import { Link } from 'react-router'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { Tab } from '../Tab'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
)

export const TabLink = props => {
  const classes = useStyles()

  return <Tab {...props} className={classes.root} component={Link} />
}
