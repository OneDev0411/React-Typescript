import React from 'react'

import { Box } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import PageLayout from 'components/GlobalPageLayout'

import Welcome from './Welcome'
// import Stats from './Stats'

const useStyles = makeStyles(
  (theme: Theme) => ({
    arrow: {
      position: 'absolute',
      bottom: 115,
      right: 115,
      width: 85,
      height: 85,
      background: 'url(/static/images/overview/arrow.png) no-repeat',
      zIndex: 1
    }
  }),
  { name: 'Overview' }
)

function OverviewDashboard() {
  const classes = useStyles()

  return (
    <PageLayout>
      <PageLayout.Header title="Dashboard" />
      <PageLayout.Main>
        <Box className={classes.arrow} />
        <Welcome />
        {/* <Box display="flex" mt={5} mb={5}>
          <Stats title="Production" value="$7,000,250" change={15} />
          <Stats title="Active Deals" value="8" change={20} />
          <Stats title="Pending Deals" value="2" change={-4} />
          <Stats title="Closed Deals" value="12" change={12} />
        </Box> */}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default OverviewDashboard
