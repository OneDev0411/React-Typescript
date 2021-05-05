import { Box } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import MetabaseDashboard from 'components/MetabaseIFrame'

import { Greeting } from './Greetings'
import { Dailies } from './Dailies'

const useStyles = makeStyles(
  (theme: Theme) => ({
    main: {
      display: 'flex',
      // height: '84vh', // dashboard container needs to be the same height as screen
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
      margin: '0 auto'
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
      <Box className={classes.dailies}>
        <Box className={classes.centeredContainer}>
          <Dailies />
        </Box>
      </Box>
      <Box className={classes.centeredContainer}>
        <MetabaseDashboard dashboardId="bc5561e9-7755-4ed8-a312-5cced96000f7" />
      </Box>
    </Box>
  )
}

export default OverviewDashboard
