import { Helmet } from 'react-helmet'

import PageLayout from 'components/GlobalPageLayout'

import Welcome from './Welcome'

function OverviewDashboard() {
  return (
    <>
      <Helmet>
        <title>Rechat | Today</title>
      </Helmet>
      <PageLayout padding={0}>
        <PageLayout.HeaderWithBackground title="Today" />
        <PageLayout.Main mt={4}>
          <Welcome />
        </PageLayout.Main>
      </PageLayout>
    </>
  )
}

export default OverviewDashboard
