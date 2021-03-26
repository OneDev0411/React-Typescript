import React from 'react'
import { Link, LinkProps } from 'react-router'
import { createStyles, makeStyles, Theme, TabProps } from '@material-ui/core'

import { Tab } from '../Tab'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: theme.spacing(8),
      color: theme.palette.common.black,
      ...theme.typography.body1,
      '&.Mui-selected': {
        ...theme.typography.subtitle1,
        fontWeight: 'bold'
      },
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

export type TabLinkProps = Omit<TabProps, 'className' | 'component'> &
  Pick<LinkProps, 'to'>

export const TabLink = (props: TabLinkProps) => {
  const classes = useStyles()
  const otherProps = {
    component: Link
  }

  return <Tab {...props} className={classes.root} {...otherProps} />
}
