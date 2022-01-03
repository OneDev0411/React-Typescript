import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import SuperCampaignAdminList from './SuperCampaignAdminList'
import SuperCampaignAgentList from './SuperCampaignAgentList'

function SuperCampaignGridView() {
  const isAdmin = useAcl(ACL.ADMIN)

  if (isAdmin) {
    return <SuperCampaignAdminList />
  }

  return <SuperCampaignAgentList />
}

export default SuperCampaignGridView
