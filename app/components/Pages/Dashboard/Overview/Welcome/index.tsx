import React from 'react'

import { Box, Button, Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  mdiNewspaperVariantOutline,
  mdiCurrencyUsd,
  mdiBellOutline,
  mdiCalendarAccount,
  mdiHeadphones
} from '@mdi/js'
import { useDispatch, useSelector } from 'react-redux'
import { browserHistory } from 'react-router'
import { ThunkDispatch } from 'redux-thunk'

import { AccessButton } from '@app/components/Pages/Dashboard/Overview/components/AccessButton'
import { EmptyState } from '@app/components/Pages/Dashboard/Overview/components/EmptyState'
import { ACL } from '@app/constants/acl'
import { useActiveBrandId } from '@app/hooks/brand'
import { activateIntercom } from '@app/store_actions/intercom'
import MetabaseDashboard from 'components/MetabaseIFrame'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { IAppState } from 'reducers'
import { InboxAction } from 'reducers/inbox/types'
import Acl from 'views/components/Acl'

import PromoteListingsSection from '../../Marketing/Overview/Sections/PromoteListingsSection'
import { AccessButtonType } from '../types.d'

import { Dailies } from './Dailies'

const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }
const insightAccess = { oneOf: [ACL.MARKETING, ACL.CRM] }
const marketingAccess = { oneOf: [ACL.MARKETING, ACL.AGENT_NETWORK] }
const allAccess = {
  oneOf: [
    ACL.DEALS,
    ACL.BACK_OFFICE,
    ACL.MARKETING,
    ACL.CRM,
    ACL.MARKETING,
    ACL.AGENT_NETWORK
  ]
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    boxContainer: {
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.white,
      height: '300px',
      padding: theme.spacing(1),
      overflowY: 'scroll',
      width: '100%',
      marginBottom: theme.spacing(3)
    },
    container: {
      display: 'flex',
      maxWidth: '1600px',
      padding: theme.spacing(0)
    },
    dailies: {
      flex: 1
    },
    greeting: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    main: {
      display: 'flex',
      borderRadius: theme.shape.borderRadius,
      flexDirection: 'column',
      padding: theme.spacing(0, 5)
    }
  }),
  { name: 'WelcomeBox' }
)

function OverviewDashboard() {
  const classes = useStyles()

  const dispatch = useDispatch<ThunkDispatch<any, any, InboxAction>>()

  const activeBrandId = useActiveBrandId()
  const [statuses] = useBrandStatuses(activeBrandId)

  const { isActive: isIntercomActive } = useSelector(
    (state: IAppState) => state.intercom
  )

  const handleOpenSupportDialogueBox = () =>
    !isIntercomActive && dispatch(activateIntercom(isIntercomActive))

  const AccessItems: AccessButtonType[] = [
    {
      access: marketingAccess,
      icon: mdiBellOutline,
      id: 'marketing',
      label: 'Marketing',
      to: '/dashboard/marketing'
    },
    {
      access: dealsAccess,
      icon: mdiCurrencyUsd,
      id: 'deals',
      label: 'Deals',
      to: '/dashboard/deals'
    },
    {
      access: ['CRM'],
      icon: mdiCalendarAccount,
      id: 'contacts',
      label: 'Contacts',
      to: '/dashboard/contacts'
    },
    {
      access: marketingAccess,
      icon: mdiNewspaperVariantOutline,
      id: 'agent-network',
      label: 'Agent Network',
      to: '/dashboard/agent-network'
    },
    {
      access: insightAccess,
      icon: mdiNewspaperVariantOutline,
      id: 'insight',
      label: 'Insight',
      to: '/dashboard/insights'
    },
    {
      access: ACL.WEBSITES,
      icon: mdiNewspaperVariantOutline,
      id: 'blog',
      label: 'Blog',
      to: '/dashboard/websites'
    },
    {
      access: allAccess,
      icon: mdiHeadphones,
      id: 'support',
      label: 'Support',
      action: handleOpenSupportDialogueBox
    }
  ]

  return (
    <Box className={classes.main}>
      <Box mb={6}>
        {AccessItems.map(item => (
          <AccessButton key={item.id} data={item} />
        ))}
      </Box>
      <Acl.Crm>
        <Box className={classes.dailies}>
          <Box className={classes.container}>
            <Dailies />
          </Box>
        </Box>
      </Acl.Crm>
      <Acl.Marketing>
        <Box className={classes.container}>
          <PromoteListingsSection title="To Market" dashboardStyles />
        </Box>
      </Acl.Marketing>
      <Acl.Deals>
        <Box className={classes.container} flexDirection="column">
          <Box pb={1.5} pt={1.5}>
            <Typography variant="h6">To Track</Typography>
          </Box>
          {statuses?.length > 0 ? (
            <MetabaseDashboard dashboardId="e044be48-42c7-456f-8077-024c93feb99d" />
          ) : (
            <Box className={classes.boxContainer}>
              <EmptyState
                description="Whether you are helping a seller, a buyer, a tenant or a land lord, you start by creating a deal."
                iconSrc="/static/icons/empty-states/statistics.svg"
                title="Start inputting your transactions and get your analytics here"
              >
                <Box pt={3}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      browserHistory.push('/dashboard/deals/create')
                    }
                  >
                    Create New Deal
                  </Button>
                </Box>
              </EmptyState>
            </Box>
          )}
        </Box>
      </Acl.Deals>
    </Box>
  )
}

export default OverviewDashboard
