import { useTitle } from 'react-use'

import { withRouter } from '@app/routes/with-router'

import InsightsPageLayout from '../PageLayout'
import type { SortableColumnsType } from '../types'

import { InsightsTable } from './InsightsTable'

const SORT_FIELD_INSIGHT_KEY = 'insight_layout_sort_field'

const SortOptions: SortableColumnsType[] = [
  { label: 'Newest Executed', value: '-executed_at', ascending: false },
  { label: 'Oldest Executed', value: 'executed_at', ascending: true },
  { label: 'Newest Created', value: '-created_at', ascending: false },
  { label: 'Oldest Created', value: 'created_at', ascending: true }
]

function InsightExecutedList() {
  useTitle('Executed Insight | Rechat')

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

export default withRouter(InsightExecutedList)
