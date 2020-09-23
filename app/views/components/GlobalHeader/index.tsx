import React from 'react'
import {
  Typography,
  makeStyles,
  Theme,
  useMediaQuery,
  createStyles
} from '@material-ui/core'
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
    },
    globalAction: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        marginTop: 0,
        marginLeft: theme.spacing(1)
      }
    }
  })

const useStyles = makeStyles(styles, { name: 'GlobalHeader' })

export interface GlobalHeaderProps {
  title?: string
  noPadding?: boolean
  isHiddenOnMobile?: boolean
  noGlobalActionsButton?: boolean
  children?: React.ReactNode
  onCreateEvent?: (event: IEvent) => void
  onCreateContact?: (contact: IContact) => void
  onCreateAndAddNewContact?: (contact: IContact) => void
  onCreateEmail?: (email: IEmailCampaign) => void
  onCreateEmailFollowUp?: (email: IEvent) => void
  onCreateTour?: (
    tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => void
  onCreateOpenHouse?: (
    oh: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => void
}

export default function GlobalHeader({
  title,
  noGlobalActionsButton,
  children,
  onCreateEvent = noop,
  onCreateContact,
  onCreateAndAddNewContact,
  onCreateEmail = noop,
  onCreateEmailFollowUp = noop,
  onCreateTour = noop,
  onCreateOpenHouse = noop,
  isHiddenOnMobile = true,
  ...restProps
}: GlobalHeaderProps & ClassesProps<typeof styles>) {
  const classes = useStyles(restProps)
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
            onCreateAndAddNewContact={onCreateAndAddNewContact}
            onCreateEmail={onCreateEmail}
            onCreateEmailFollowUp={onCreateEmailFollowUp}
            onCreateTour={onCreateTour}
            onCreateOpenHouse={onCreateOpenHouse}
          />
        </div>
      )}
    </div>
  )
}
