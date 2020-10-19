import React from 'react'

import { Box, Theme, makeStyles, Typography, Link } from '@material-ui/core'
import ParentSize from '@visx/responsive/lib/components/ParentSize'

import PageLayout from 'components/GlobalPageLayout'

import Greeting from './Greeting'
import Stats from './Stats'
import Chart from './Chart'
import UpcomingCelebrations from './UpcomingCelebrations'
import DatePeriodSwitcher from './DatePeriodSwitcher'

const useStyles = makeStyles(
  (theme: Theme) => ({
    widgetContainer: {
      width: 'calc(100% - 0.5rem)',
      marginRight: '1rem',
      '&:last-child': {
        marginRight: 0
      }
    },
    widgetInnerContainer: {
      border: `1px dotted ${theme.palette.grey['300']}`,
      padding: theme.spacing(2),
      borderRadius: '16px',
      marginTop: theme.spacing(1)
    }
  }),
  { name: 'OverviewDashboard' }
)

function OverviewDashboard() {
  const classes = useStyles()

  return (
    <PageLayout>
      <PageLayout.Header title="Dashboard" />
      <PageLayout.Main>
        <DatePeriodSwitcher />
        <Greeting />
        <Box display="flex" mt={10} mb={10}>
          <Stats title="Production" value="$7,000,250" change={15} />
          <Stats title="Active Deals" value="8" change={20} />
          <Stats title="Pending Deals" value="2" change={-4} />
          <Stats title="Closed Deals" value="12" change={12} />
        </Box>
        <Box display="flex">
          <Box className={classes.widgetContainer}>
            <Typography variant="body2">
              Your deals history.{' '}
              <Link href="/dashboard/deals" color="secondary">
                Go to deals
              </Link>
            </Typography>
            <Box
              width="100%"
              height="250px"
              className={classes.widgetInnerContainer}
            >
              <ParentSize>
                {({ width, height }) => <Chart width={width} height={height} />}
              </ParentSize>
            </Box>
          </Box>
          <Box className={classes.widgetContainer}>
            <Typography variant="body2">
              Upcoming Celebrations.{' '}
              <Link href="/dashboard/calendar" color="secondary">
                See more events
              </Link>
            </Typography>
            <Box
              width="100%"
              height="250px"
              className={classes.widgetInnerContainer}
            >
              <UpcomingCelebrations />
            </Box>
          </Box>
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default OverviewDashboard
