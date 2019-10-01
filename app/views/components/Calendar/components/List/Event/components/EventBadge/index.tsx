import * as React from 'react'
import { ReactNode } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { ClassesProps } from 'utils/ts-utils'

interface Props {
  children: ReactNode
  padding?: 'dense' | 'normal'
}

const styles = (theme: Theme) =>
  createStyles({
    root: ({ padding }: Props) => ({
      borderRadius: '40px',
      background: theme.palette.grey['200'],
      margin: theme.spacing(0, 0, 0, 1),
      padding:
        padding === 'dense' ? theme.spacing(0.5, 0.5) : theme.spacing(1, 1),
      lineHeight: 0.6,
      verticalAlign: 'baseline',
      display: 'inline-block',
      fontSize: '0.92rem'
    })
  })
const useStyles = makeStyles(styles, { name: 'EventBadge' })

export function EventBadge({
  padding,
  ...props
}: Props & ClassesProps<typeof styles>) {
  const classes = useStyles({ ...props, padding })

  return <span className={classes.root}>{props.children}</span>
}
