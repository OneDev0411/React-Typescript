import { useHasSuperCampaignAccess } from '@app/components/Pages/Dashboard/SuperCampaigns/hooks/use-has-super-campaign-access'

import SuperCampaignsSectionLayout from './SuperCampaignsSectionLayout'

function SuperCampaignsSection() {
  const hasSuperCampaignAccess = useHasSuperCampaignAccess()

  if (!hasSuperCampaignAccess) {
    return null
  }

  return <SuperCampaignsSectionLayout />
}

export default SuperCampaignsSection
