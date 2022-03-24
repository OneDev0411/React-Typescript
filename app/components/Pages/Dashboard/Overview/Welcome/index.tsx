import { Box, Button, Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { browserHistory } from 'react-router'

import { EmptyState } from '@app/components/Pages/Dashboard/Overview/components/EmptyState'
import { ACL } from '@app/constants/acl'
import Acl from '@app/views/components/Acl'
import { useAcl } from '@app/views/components/Acl/use-acl'
import MetabaseDashboard from '@app/views/components/MetabaseIFrame'

import { useDealsList } from '../../Deals/List/Agent/hooks/use-deals-list'
import { AccessButtons } from '../components/AccessButtons'
import PromoteListingsSection from '../components/PromoteListingsSection'

import { Dailies } from './Dailies'

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
      flexDirection: 'column'
    },
    title: {
      paddingBottom: theme.spacing(1.5),
      paddingTop: theme.spacing(3)
    }
  }),
  { name: 'WelcomeBox' }
)

function OverviewDashboard() {
  const classes = useStyles()

  const isAdmin = useAcl(ACL.ADMIN)
  const getDealsList = useDealsList()
  const deals = getDealsList()

  return (
    <Box className={classes.main}>
      <AccessButtons />
      <Acl.Crm>
        <Box className={classes.dailies}>
          <Box className={classes.container}>
            <Dailies />
          </Box>
        </Box>
      </Acl.Crm>
      <Acl.Marketing>
        <Box className={classes.container}>
          <PromoteListingsSection />
        </Box>
      </Acl.Marketing>
      <Acl.Deals>
        <Box className={classes.container} flexDirection="column">
          <Box className={classes.title}>
            <Typography variant="h6">To Track</Typography>
          </Box>
          {isAdmin || deals?.length > 0 ? (
            <MetabaseDashboard dashboardId="e044be48-42c7-456f-8077-024c93feb99d" />
          ) : (
            <Box className={classes.boxContainer}>
              <EmptyState
                description="Whether you’re helping a seller, buyer, renter, or landlord, your transactions begin here. Click on Create New Deal to get started."
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
