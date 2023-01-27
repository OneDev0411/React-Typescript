import { memo } from 'react'

import { useTitle } from 'react-use'

import SuperCampaignGridView from '@app/components/Pages/Dashboard/SuperCampaigns/pages/SuperCampaignGridView'
import { ACL } from '@app/constants/acl'
import { withRouter } from '@app/routes/with-router'
import { useAcl } from '@app/views/components/Acl/use-acl'

import InsightsPageLayout from '../../PageLayout'
import type { SortableColumnsType } from '../../types'

const SORT_FIELD_INSIGHT_KEY = 'insight_super_campaigns_sort_field'

const SortOptions: SortableColumnsType[] = [
  { label: 'Newest', value: '-created_at', ascending: false },
  { label: 'Oldest', value: 'created_at', ascending: true }
]

function SuperCampaignList() {
  useTitle('Campaign List | Rechat')

  const isAdmin = useAcl(ACL.ADMIN)

  return (
    <InsightsPageLayout
      disableSort={!isAdmin}
      sortKey={SORT_FIELD_INSIGHT_KEY}
      sortOptions={SortOptions}
    >
      {({ sortField }) => (
        <SuperCampaignGridView isAdmin={isAdmin} sortBy={sortField} />
      )}
    </InsightsPageLayout>
  )
}

export default memo(withRouter(SuperCampaignList))
