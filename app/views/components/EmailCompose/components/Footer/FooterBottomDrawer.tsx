import React, { ReactNode } from 'react'

import {
  createStyles,
  makeStyles,
  Paper,
  Slide,
  Theme
} from '@material-ui/core'

import { ClassesProps } from 'utils/ts-utils'

interface Props {
  isOpen: boolean
  children: ReactNode
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '100%',
      zIndex: 1,
      background: theme.palette.background.paper,
      borderTop: `1px solid ${theme.palette.divider}`,
      maxHeight: '21rem',
      minHeight: '21rem',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }
  })
const ueStyles = makeStyles(styles, {
  name: 'FooterBottomDrawer'
})

export function FooterBottomDrawer(props: Props & ClassesProps<typeof styles>) {
  const classes = ueStyles(props)

  return (
    <Slide direction="up" in={props.isOpen} mountOnEnter unmountOnExit>
      <Paper square className={classes.root}>
        {props.children}
      </Paper>
    </Slide>
  )
}
