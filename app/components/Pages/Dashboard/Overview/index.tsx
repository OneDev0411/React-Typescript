import React from 'react'

import PageLayout from 'components/GlobalPageLayout'

import Welcome from './Welcome'

function OverviewDashboard() {
  return (
    <PageLayout padding={0}>
      <PageLayout.HeaderWithBackground title="Home" />
      <PageLayout.Main mt={4}>
        <Welcome />
      </PageLayout.Main>
    </PageLayout>
  )
}

export default OverviewDashboard
