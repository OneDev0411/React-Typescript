import React from 'react'
import { Typography, makeStyles, Theme } from '@material-ui/core'

import GlobalActionsButton from 'components/GlobalActionsButton'

export interface GlobalHeaderProps {
  title?: string
  noPadding?: boolean
  noGlobalActionsButton?: boolean
  children?: React.ReactNode
  onCreateEvent?: (event: IEvent) => void
}

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ({ noPadding }: GlobalHeaderProps) =>
      !noPadding ? theme.spacing(3) : 0,
    width: '100%',
    overflow: 'hidden'
  },
  title: {
    marginRight: theme.spacing(1),
    // According to Shayan, the title looks a little misaligned vertically.
    // This is a fix for it to look better with the actions button and the search box.
    alignSelf: 'flex-start'
  },
  content: {
    flexGrow: 1
  },
  globalAction: {
    marginLeft: theme.spacing(1)
  }
}))

export default function GlobalHeader({
  title,
  noPadding,
  noGlobalActionsButton,
  children,
  onCreateEvent = () => {}
}: GlobalHeaderProps) {
  const classes = useStyles({ noPadding })

  return (
    <div className={classes.wrapper}>
      {title && (
        <Typography variant="h4" noWrap className={classes.title}>
          {title}
        </Typography>
      )}
      {children && <div className={classes.content}>{children}</div>}
      {!noGlobalActionsButton && (
        <div className={classes.globalAction}>
          <GlobalActionsButton onCreateEvent={onCreateEvent} />
        </div>
      )}
    </div>
  )
}
