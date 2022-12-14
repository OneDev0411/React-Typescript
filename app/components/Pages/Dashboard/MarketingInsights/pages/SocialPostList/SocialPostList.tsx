import { memo } from 'react'

import { useTitle } from 'react-use'

import { withRouter } from '@app/routes/with-router'

import InsightsPageLayout from '../../PageLayout'

import SocialPostTable from './SocialPostTable'

function SocialPostList() {
  useTitle('Instagram Post List | Rechat')

  return (
    <InsightsPageLayout>
      {({ sortField }) => <SocialPostTable sortBy={sortField} />}
    </InsightsPageLayout>
  )
}

export default memo(withRouter(SocialPostList))
