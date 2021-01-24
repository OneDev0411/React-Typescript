import React from 'react'

// import { Box } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import Welcome from './Welcome'
// import Stats from './Stats'

function OverviewDashboard() {
  return (
    <PageLayout>
      <PageLayout.Header title="Dashboard" />
      <PageLayout.Main>
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
