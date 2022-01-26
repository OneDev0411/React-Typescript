import React from 'react'

import {
  Typography,
  makeStyles,
  Theme,
  useMediaQuery,
  createStyles
} from '@material-ui/core'

import { Greeting } from '@app/components/Pages/Dashboard/Overview/Welcome/Greetings'
import { ClassesProps } from 'utils/ts-utils'

const styles = (theme: Theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      padding: ({ noPadding }: GlobalHeaderWithBackgroundProps) =>
        !noPadding ? theme.spacing(4) : 0,
      width: '100%',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    },
    leftSideWrapper: {},
    title: {
      fontWeight: 900,
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

const useStyles = makeStyles(styles, { name: 'GlobalHeaderWithBackground' })

export interface GlobalHeaderWithBackgroundProps {
  title?: string
  noPadding?: boolean
  isHiddenOnMobile?: boolean
  children?: React.ReactNode
}

export default function GlobalHeaderWithBackground({
  title,
  children,
  isHiddenOnMobile = true,
  ...restProps
}: GlobalHeaderWithBackgroundProps & ClassesProps<typeof styles>) {
  const classes = useStyles(restProps)
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'))

  if (isHiddenOnMobile && isMobile) {
    return null
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.leftSideWrapper}>
        {title && (
          <Typography variant="h5" noWrap className={classes.title}>
            {title}
          </Typography>
        )}

        <Greeting />
      </div>
      {children && <div className={classes.content}>{children}</div>}
    </div>
  )
}
