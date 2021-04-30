import { Box } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import Greeting from './Greetings'
import DailyUpdates from './DailyUpdates'

const useStyles = makeStyles(
  (theme: Theme) => ({
    main: {
      display: 'flex',
      height: '84vh', // dashboard container needs to be the same height as screen
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: theme.shape.borderRadius,
      background: 'url(/static/images/overview/dashboard-bg.png) no-repeat 0 0',
      flexDirection: 'column'
    },
    greeting: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    stats: {
      flex: 1
    }
  }),
  { name: 'Dai' }
)

function OverviewDashboard() {
  const classes = useStyles()

  return (
    <Box className={classes.main}>
      <Box className={classes.greeting}>
        <Greeting />
      </Box>
      <Box className={classes.stats}>
        <DailyUpdates />
      </Box>
    </Box>
  )
}

export default OverviewDashboard
