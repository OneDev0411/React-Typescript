import { memo } from 'react'

import { useTitle } from 'react-use'

import { withRouter } from '@app/routes/with-router'

import InsightsPageLayout from '../../PageLayout'
import type { SortableColumnsType } from '../../types'

import SocialPostTable from './SocialPostTable'

const SORT_FIELD_INSIGHT_KEY = 'insight_social_posts_sort_field'

const SortOptions: SortableColumnsType[] = [
  { label: 'Newest', value: '-created_at', ascending: false },
  { label: 'Oldest', value: 'created_at', ascending: true }
]

function SocialPostList() {
  useTitle('Instagram Post List | Rechat')

  return (
    <InsightsPageLayout
      sortKey={SORT_FIELD_INSIGHT_KEY}
      sortOptions={SortOptions}
    >
      {({ sortField }) => <SocialPostTable sortBy={sortField} />}
    </InsightsPageLayout>
  )
}

export default memo(withRouter(SocialPostList))
