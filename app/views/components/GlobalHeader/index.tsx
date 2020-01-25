import React from 'react'
import { Typography, makeStyles, Theme } from '@material-ui/core'

import GlobalActionsButton from 'components/GlobalActionsButton'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    width: '100%'
  },
  content: {
    flexGrow: 1
  }
}))

interface Props {
  title?: string
  noGlobalActionsButton?: boolean
  children?: React.ReactNode
}

export default function GlobalHeader({
  title,
  noGlobalActionsButton,
  children
}: Props) {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      {title && (
        <div>
          <Typography variant="h3">{title}</Typography>
        </div>
      )}
      {children && <div className={classes.content}>{children}</div>}
      {!noGlobalActionsButton && (
        <div>
          <GlobalActionsButton />
        </div>
      )}
    </div>
  )
}
