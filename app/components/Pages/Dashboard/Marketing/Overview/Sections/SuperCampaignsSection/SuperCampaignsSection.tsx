import SectionLayout from '../SectionLayout'

import SuperCampaignsSectionContent from './SuperCampaignsSectionContent'
import { useGetSuperCampaignsWithEnrollment } from './use-get-super-campaigns-with-enrollment'

function SuperCampaignsSection() {
  const {
    superCampaignsWithEnrollment,
    setSuperCampaignsWithEnrollment,
    isLoading
  } = useGetSuperCampaignsWithEnrollment()

  const isEmpty = !isLoading && superCampaignsWithEnrollment.length === 0

  return (
    <SectionLayout title="Campaigns" containerGridProps={{ sm: 12 }}>
      <SuperCampaignsSectionContent
        isEmpty={isEmpty}
        isLoading={isLoading}
        superCampaignsWithEnrollment={superCampaignsWithEnrollment}
        setSuperCampaignsWithEnrollment={setSuperCampaignsWithEnrollment}
      />
    </SectionLayout>
  )
}

export default SuperCampaignsSection
