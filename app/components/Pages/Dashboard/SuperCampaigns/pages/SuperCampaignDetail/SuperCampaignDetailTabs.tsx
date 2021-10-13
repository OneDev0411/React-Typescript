import { PageTabs, TabLink } from 'components/PageTabs'

import { superCampaignDetailTabs } from '../../constants'
import { SuperCampaignDetailTabType } from '../../types'

export interface SuperCampaignDetailTabsProps {
  superCampaignId: UUID
  value: SuperCampaignDetailTabType
}

function SuperCampaignDetailTabs({
  superCampaignId,
  value
}: SuperCampaignDetailTabsProps) {
  const tabs = [
    <TabLink
      key={1}
      value={superCampaignDetailTabs.Overview}
      to={`/dashboard/super-campaigns/${superCampaignId}/detail/${superCampaignDetailTabs.Overview}`}
      label="Overview"
    />,
    <TabLink
      key={2}
      value={superCampaignDetailTabs.Results}
      to={`/dashboard/super-campaigns/${superCampaignId}/detail/${superCampaignDetailTabs.Results}`}
      label="Results"
    />
  ]

  return (
    <PageTabs
      defaultValue={value}
      hasMegaMenu
      tabs={tabs}
      containerStyle={{ marginBottom: 0 }}
    />
  )
}

export default SuperCampaignDetailTabs
