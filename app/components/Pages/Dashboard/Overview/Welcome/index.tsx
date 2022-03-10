import { Box, Button, Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { browserHistory } from 'react-router'
import { ThunkDispatch } from 'redux-thunk'

import { AccessButton } from '@app/components/Pages/Dashboard/Overview/components/AccessButton'
import { EmptyState } from '@app/components/Pages/Dashboard/Overview/components/EmptyState'
import { ACL } from '@app/constants/acl'
import { activateIntercom } from '@app/store_actions/intercom'
import { useAcl } from '@app/views/components/Acl/use-acl'
import MetabaseDashboard from 'components/MetabaseIFrame'
import { IAppState } from 'reducers'
import { InboxAction } from 'reducers/inbox/types'
import Acl from 'views/components/Acl'

import { useDealsList } from '../../Deals/List/Agent/hooks/use-deals-list'
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
      marginBottom: theme.spacing(3),
      padding: theme.spacing(1),
      overflowY: 'scroll',
      width: '100%'
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
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      justifyContent: 'center'
    },
    main: {
      borderRadius: theme.shape.borderRadius,
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(0, 5)
    }
  }),
  { name: 'WelcomeBox' }
)

function OverviewDashboard() {
  const classes = useStyles()

  const dispatch = useDispatch<ThunkDispatch<any, any, InboxAction>>()
  const isAdmin = useAcl(ACL.ADMIN)
  const getDealsList = useDealsList()
  const deals = getDealsList()

  const { isActive: isIntercomActive } = useSelector(
    (state: IAppState) => state.intercom
  )

  const handleOpenSupportDialogueBox = () =>
    !isIntercomActive && dispatch(activateIntercom(isIntercomActive))

  const handleOpenExternalLink = link =>
    window.open(link, '_blank', 'noopener noreferrer')

  const AccessItems: AccessButtonType[] = [
    {
      access: marketingAccess,
      id: 'marketing',
      label: 'Marketing',
      to: '/dashboard/marketing'
    },
    {
      access: dealsAccess,
      id: 'deals',
      label: 'Deals',
      to: '/dashboard/deals'
    },
    {
      access: ['CRM'],
      id: 'contacts',
      label: 'Contacts',
      to: '/dashboard/contacts'
    },
    {
      access: marketingAccess,
      id: 'agent-network',
      label: 'Agent Network',
      to: '/dashboard/agent-network'
    },
    {
      access: insightAccess,
      id: 'insight',
      label: 'Insight',
      to: '/dashboard/insights'
    },
    {
      access: allAccess,
      id: 'blog',
      label: 'Blog',
      action: () => handleOpenExternalLink('https://rechat.com/blog/')
    },
    {
      access: allAccess,
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
          {isAdmin || deals?.length > 0 ? (
            <MetabaseDashboard dashboardId="e044be48-42c7-456f-8077-024c93feb99d" />
          ) : (
            <Box className={classes.boxContainer}>
              <EmptyState
                description="Start managing your transactions all in one place and track your stats here. Whether you are helping a seller, a buyer, a tenant, or a landlord, you start by creating a deal."
                iconSrc="/static/icons/empty-states/statistics.svg"
                title="You don’t have any deals, yet."
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
