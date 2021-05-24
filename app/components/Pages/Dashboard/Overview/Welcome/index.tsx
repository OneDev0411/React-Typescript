import { Box } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import MetabaseDashboard from 'components/MetabaseIFrame'

import Acl from 'views/components/Acl'

import { Greeting } from './Greetings'
import { Dailies } from './Dailies'

const useStyles = makeStyles(
  (theme: Theme) => ({
    main: {
      display: 'flex',
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: theme.shape.borderRadius,
      background: 'url(/static/images/overview/dashboard-bg.png) no-repeat 0 0',
      flexDirection: 'column'
    },
    centeredContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '90%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: theme.spacing(3, 0)
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
      <Box className={classes.greeting}>
        <Greeting />
      </Box>
      <Acl.Crm>
        <Box className={classes.dailies}>
          <Box className={classes.centeredContainer}>
            <Dailies />
          </Box>
        </Box>
      </Acl.Crm>
      <Acl.Deals>
        <Box className={classes.centeredContainer}>
          <MetabaseDashboard dashboardId="e044be48-42c7-456f-8077-024c93feb99d" />
        </Box>
      </Acl.Deals>
    </Box>
  )
}

export default OverviewDashboard
