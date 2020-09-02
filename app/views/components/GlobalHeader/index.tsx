import React from 'react'
import { Typography, makeStyles, Theme, useMediaQuery } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { noop } from 'utils/helpers'
import {
  hasUserAccessToCrm,
  hasUserAccessToDeals,
  hasUserAccessToMarketingCenter
} from 'utils/user-teams'

import GlobalActionsButton from 'components/GlobalActionsButton'
import { ItemType } from 'components/GlobalActionsButton/types'

export interface GlobalHeaderProps {
  title?: string
  noPadding?: boolean
  isHiddenOnMobile?: boolean
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
  onCreateOpenHouse = noop,
  isHiddenOnMobile = true
}: GlobalHeaderProps) {
  const classes = useStyles({ noPadding })
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'))
  const availableActions: ItemType[] = []

  const user = useSelector((store: IAppState) => store.user)

  if (isHiddenOnMobile && isMobile) {
    return null
  }

  if (hasUserAccessToCrm(user)) {
    availableActions.push('email', 'event', 'contact', 'tour')
  }

  if (hasUserAccessToDeals(user)) {
    availableActions.push('deal')
  }

  if (hasUserAccessToCrm(user) && hasUserAccessToMarketingCenter(user)) {
    availableActions.push('openhouse')
  }

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
            availableActions={availableActions}
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
