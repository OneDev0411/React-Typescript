import SectionLayout from '../SectionLayout'

import SuperCampaignCards from './SuperCampaignCards'
import { useGetSuperCampaignsWithEnrollment } from './use-get-super-campaigns-with-enrollment'

function SuperCampaignsSection() {
  const { superCampaignsWithEnrollment, setSuperCampaignsWithEnrollment } =
    useGetSuperCampaignsWithEnrollment()

  // TODO: Handle loading and empty state

  return (
    <SectionLayout title="Campaigns" gridProps={{ sm: 12 }}>
      <SuperCampaignCards
        superCampaignsWithEnrollment={superCampaignsWithEnrollment}
        setSuperCampaignsWithEnrollment={setSuperCampaignsWithEnrollment}
      />
    </SectionLayout>
  )
}

export default SuperCampaignsSection
