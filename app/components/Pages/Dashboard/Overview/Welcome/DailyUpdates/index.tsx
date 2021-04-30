import { Box, Typography, Link } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { mdiCalendarToday } from '@mdi/js'
import { mdiGiftOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import TodaysSchedule from './TodaysSchedule'
import UpcomingCelebrations from './UpcomingCelebrations'

const useStyles = makeStyles(
  (theme: Theme) => ({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(12),
      paddingTop: 0
    },
    boxWrapper: {
      marginLeft: theme.spacing(2),
      flex: 1,
      maxWidth: '600px'
    },
    boxTitle: {
      marginBottom: theme.spacing(2),
      display: 'flex',
      alignItems: 'flex-start',
      fontSize: '16px'
    },
    boxContainer: {
      border: `1px solid ${theme.palette.grey[300]}`,
      padding: theme.spacing(2),
      height: '350px',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper
    },
    boxFooter: {
      textAlign: 'right',
      marginTop: theme.spacing(2)
    }
  }),
  { name: 'DailyUpdates' }
)

export default function DailyUpdates() {
  const classes = useStyles()

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.boxWrapper}>
        <Typography variant="h6" className={classes.boxTitle}>
          <SvgIcon path={mdiCalendarToday} rightMargined />
          Today's Schedule
        </Typography>
        <Box className={classes.boxContainer}>
          <TodaysSchedule />
        </Box>
        <Box className={classes.boxFooter}>
          <Link href="#">View Calendar</Link>
        </Box>
      </Box>
      <Box className={classes.boxWrapper}>
        <Typography variant="h6" className={classes.boxTitle}>
          <SvgIcon path={mdiGiftOutline} rightMargined />
          Upcoming Celebrations
        </Typography>
        <Box className={classes.boxContainer}>
          <UpcomingCelebrations />
        </Box>
        <Box className={classes.boxFooter}>
          <Link href="#">View All</Link>
        </Box>
      </Box>
    </Box>
  )
}
