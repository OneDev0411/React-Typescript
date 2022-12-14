import { useTitle } from 'react-use'

import { withRouter } from '@app/routes/with-router'

import InsightsPageLayout from '../PageLayout'
import type { SortableColumnsType } from '../types'

import { InsightsTable } from './InsightsTable'

const SORT_FIELD_INSIGHT_KEY = 'insight_scheduled_sort_field'

const SortOptions: SortableColumnsType[] = [
  { label: 'Newest Created', value: '-created_at', ascending: false },
  { label: 'Oldest Created', value: 'created_at', ascending: true }
]

function InsightScheduledList() {
  useTitle('Scheduled Insight | Rechat')

  return (
    <InsightsPageLayout
      sortKey={SORT_FIELD_INSIGHT_KEY}
      sortOptions={SortOptions}
    >
      {() => {
        return <InsightsTable />
      }}
    </InsightsPageLayout>
  )
}

export default withRouter(InsightScheduledList)
