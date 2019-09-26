import {
  ButtonBase,
  createStyles,
  Divider,
  makeStyles,
  Theme
} from '@material-ui/core'
import React from 'react'
import { ButtonBaseProps } from '@material-ui/core/ButtonBase'
import classNames from 'classnames'

import { ClassesProps } from 'utils/ts-utils'

interface Props extends ButtonBaseProps {
  numHidden: number
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'start',
      width: '100%'
    },
    badge: {
      display: 'inline-flex',
      width: '2.5rem',
      height: '2.5rem',
      justifyContent: 'center',
      alignItems: 'center',
      margin: theme.spacing(0, 0, 0, 2.5),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '50%',
      position: 'relative',
      zIndex: 1,
      backgroundColor: theme.palette.background.paper
    },
    firstLine: {
      top: 'calc(50% - 4px)'
    },
    secondLine: {
      top: 'calc(50% + 4px)'
    }
  })
const useShowAllToggleStyles = makeStyles(styles, { name: 'ShowAllToggle' })

export function ShowAllToggle({
  numHidden,
  ...props
}: Props & ClassesProps<typeof styles>) {
  const classes = useShowAllToggleStyles(props)

  return (
    <ButtonBase
      {...props}
      className={classNames(classes.root, props.className)}
    >
      <span className={classes.badge}>{numHidden}</span>
      <Divider absolute className={classes.firstLine} />
      <Divider absolute className={classes.secondLine} />
    </ButtonBase>
  )
}
