import React from 'react'
import { Typography, makeStyles, Theme } from '@material-ui/core'

import GlobalActionsButton from 'components/GlobalActionsButton'

export interface GlobalHeaderProps {
  title?: string
  noPadding?: boolean
  noGlobalActionsButton?: boolean
  children?: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ({ noPadding }: GlobalHeaderProps) =>
      !noPadding ? theme.spacing(3) : 0,
    width: '100%'
  },
  globalAction: {
    marginLeft: theme.spacing(1)
  },
  content: {
    flexGrow: 1
  }
}))

export default function GlobalHeader({
  title,
  noPadding,
  noGlobalActionsButton,
  children
}: GlobalHeaderProps) {
  const classes = useStyles({ noPadding })

  return (
    <div className={classes.wrapper}>
      {title && <Typography variant="h4">{title}&nbsp;</Typography>}
      {children && <div className={classes.content}>{children}</div>}
      {!noGlobalActionsButton && (
        <div className={classes.globalAction}>
          <GlobalActionsButton />
        </div>
      )}
    </div>
  )
}
