import { Box, Button, Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { browserHistory } from 'react-router'

import { EmptyState } from '@app/components/Pages/Dashboard/Overview/components/EmptyState'
// import MetabaseDashboard from 'components/MetabaseIFrame'
import Acl from 'views/components/Acl'

import PromoteListingsSection from '../../Marketing/Overview/Sections/PromoteListingsSection'

import { Dailies } from './Dailies'

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

  return (
    <Box className={classes.main}>
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
          <Box className={classes.boxContainer}>
            <EmptyState
              description="Whether you are helping a seller, a buyer, a tenant or a land lord, you start by creating a deal."
              iconSrc="/static/icons/empty-states/statistics.svg"
              title="Start inputting your transactions and get your analytics here"
            >
              <Box pt={3}>
                <Button
                  variant="outlined"
                  onClick={() => browserHistory.push('/dashboard/deals/create')}
                >
                  Create New Deal
                </Button>
              </Box>
            </EmptyState>
          </Box>
          {/* <MetabaseDashboard dashboardId="e044be48-42c7-456f-8077-024c93feb99d" /> */}
        </Box>
      </Acl.Deals>
    </Box>
  )
}

export default OverviewDashboard
