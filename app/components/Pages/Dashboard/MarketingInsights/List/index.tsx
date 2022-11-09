import { useTitle } from 'react-use'

import InsightsPageLayout from '../PageLayout'

import { InsightsTable } from './InsightsTable'

export default function InsightsList() {
  useTitle('Insight | Rechat')

  return (
    <InsightsPageLayout>
      {() => {
        return <InsightsTable />
      }}
    </InsightsPageLayout>
  )
}
