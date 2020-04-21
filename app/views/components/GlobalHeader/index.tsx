import React from 'react'
import { Typography, makeStyles, Theme } from '@material-ui/core'

import { noop } from 'utils/helpers'
import GlobalActionsButton from 'components/GlobalActionsButton'

export interface GlobalHeaderProps {
  title?: string
  noPadding?: boolean
  noGlobalActionsButton?: boolean
  children?: React.ReactNode
  onCreateEvent?: (event: IEvent) => void
  onCreateContact?: (contact: IContact) => void
  onCreateEmail?: (email: IEmailCampaign) => void
  onCreateTour?: (
    tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => void
  onCreateOpenHouse?: (
    oh: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: ({ noPadding }: GlobalHeaderProps) =>
        !noPadding ? theme.spacing(3) : 0,
      width: '100%'
    },
    title: {
      marginRight: theme.spacing(1)
    },
    content: {
      flexGrow: 1
    },
    globalAction: {
      marginLeft: theme.spacing(1)
    }
  }),
  { name: 'GlobalHeader' }
)

export default function GlobalHeader({
  title,
  noPadding,
  noGlobalActionsButton,
  children,
  onCreateEvent = noop,
  onCreateContact = noop,
  onCreateEmail = noop,
  onCreateTour = noop,
  onCreateOpenHouse = noop
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
          <GlobalActionsButton
            onCreateEvent={onCreateEvent}
            onCreateContact={onCreateContact}
            onCreateEmail={onCreateEmail}
            onCreateTour={onCreateTour}
            onCreateOpenHouse={onCreateOpenHouse}
          />
        </div>
      )}
    </div>
  )
}