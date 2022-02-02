import SuperCampaignAdminList from './SuperCampaignAdminList'
import SuperCampaignAgentList from './SuperCampaignAgentList'

interface SuperCampaignGridViewProps {
  isAdmin: boolean
  sortBy: { ascending: boolean }
}

function SuperCampaignGridView({
  isAdmin,
  sortBy
}: SuperCampaignGridViewProps) {
  if (isAdmin) {
    return (
      <SuperCampaignAdminList sortDir={sortBy.ascending ? 'ASC' : 'DESC'} />
    )
  }

  return <SuperCampaignAgentList />
}

export default SuperCampaignGridView
