import { Box } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import MetabaseDashboard from 'components/MetabaseIFrame'
import Acl from 'views/components/Acl'

import PromoteListingsSection from '../../Marketing/Overview/Sections/PromoteListingsSection'

import { Dailies } from './Dailies'

const useStyles = makeStyles(
  (theme: Theme) => ({
    main: {
      display: 'flex',
      borderRadius: theme.shape.borderRadius,
      flexDirection: 'column',
      padding: theme.spacing(0, 5)
    },
    container: {
      display: 'flex',
      maxWidth: '1600px',
      padding: theme.spacing(0)
    },
    greeting: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    dailies: {
      flex: 1
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
        <Box className={classes.container}>
          <MetabaseDashboard dashboardId="e044be48-42c7-456f-8077-024c93feb99d" />
        </Box>
      </Acl.Deals>
    </Box>
  )
}

export default OverviewDashboard
