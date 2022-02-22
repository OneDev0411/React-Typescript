import React from 'react'

import PageLayout from 'components/GlobalPageLayout'

import Welcome from './Welcome'
// import Stats from './Stats'

function OverviewDashboard() {
  return (
    <PageLayout>
      <PageLayout.Header title="Today" />
      <PageLayout.Main>
        <Welcome />
      </PageLayout.Main>
    </PageLayout>
  )
}

export default OverviewDashboard
