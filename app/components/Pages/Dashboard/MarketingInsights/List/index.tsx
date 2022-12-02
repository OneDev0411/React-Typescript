import { useTitle } from 'react-use'

import { withRouter } from '@app/routes/with-router'

import InsightsPageLayout from '../PageLayout'

import { InsightsTable } from './InsightsTable'

function InsightsList() {
  useTitle('Insight | Rechat')

  return (
    <InsightsPageLayout>
      {() => {
        return <InsightsTable />
      }}
    </InsightsPageLayout>
  )
}

export default withRouter(InsightsList)
