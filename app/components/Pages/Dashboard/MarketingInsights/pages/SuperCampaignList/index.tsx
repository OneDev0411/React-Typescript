import { memo } from 'react'

import { useTitle } from 'react-use'

import SuperCampaignGridView from '@app/components/Pages/Dashboard/SuperCampaigns/pages/SuperCampaignGridView'
import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import InsightsPageLayout from '../../PageLayout'

function SuperCampaignList() {
  useTitle('Campaign List | Rechat')

  const isAdmin = useAcl(ACL.ADMIN)

  return (
    <InsightsPageLayout disableSort={!isAdmin}>
      {({ sortField }) => (
        <SuperCampaignGridView isAdmin={isAdmin} sortBy={sortField} />
      )}
    </InsightsPageLayout>
  )
}

export default memo(SuperCampaignList)
