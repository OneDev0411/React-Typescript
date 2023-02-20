import { useTitle } from 'react-use'

import { withRouter } from '@app/routes/with-router'
import PageLayout from 'components/GlobalPageLayout'

import Welcome from './Welcome'

function OverviewDashboard() {
  useTitle('Rechat | Today')

  return (
    <PageLayout>
      <PageLayout.Header title="Today" />
      <PageLayout.Main mt={0}>
        <Welcome />
      </PageLayout.Main>
    </PageLayout>
  )
}

export default withRouter(OverviewDashboard)
