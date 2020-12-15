import React from 'react'
import {
  Typography,
  makeStyles,
  Theme,
  useMediaQuery,
  createStyles
} from '@material-ui/core'

import { ClassesProps } from 'utils/ts-utils'

const styles = (theme: Theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      padding: ({ noPadding }: GlobalHeaderProps) =>
        !noPadding ? theme.spacing(3) : 0,
      width: '100%',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    },
    title: {
      marginBottom: theme.spacing(3),
      [theme.breakpoints.up('md')]: {
        marginBottom: 0,
        marginRight: theme.spacing(1)
      }
    },
    content: {
      [theme.breakpoints.up('md')]: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }
  })

const useStyles = makeStyles(styles, { name: 'GlobalHeader' })

export interface GlobalHeaderProps {
  title?: string
  noPadding?: boolean
  isHiddenOnMobile?: boolean
  children?: React.ReactNode
}

export default function GlobalHeader({
  title,
  children,
  isHiddenOnMobile = true,
  ...restProps
}: GlobalHeaderProps & ClassesProps<typeof styles>) {
  const classes = useStyles(restProps)
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'))

  if (isHiddenOnMobile && isMobile) {
    return null
  }

  return (
    <div className={classes.wrapper}>
      {title && (
        <Typography variant="h4" noWrap className={classes.title}>
          {title}
        </Typography>
      )}
      {children && <div className={classes.content}>{children}</div>}
    </div>
  )
}
