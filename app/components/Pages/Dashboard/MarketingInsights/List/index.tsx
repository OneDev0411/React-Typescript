import InsightsPageLayout from '../PageLayout'

import { InsightsTable } from './InsightsTable'

export default function InsightsList() {
  return <InsightsPageLayout>{() => <InsightsTable />}</InsightsPageLayout>
}
