import SectionLayout from '../SectionLayout'

import SuperCampaignCards from './SuperCampaignCards'
import SuperCampaignsSectionEmptyState from './SuperCampaignsSectionEmptyState'
import SuperCampaignsSectionLoading from './SuperCampaignsSectionLoading'
import { useGetSuperCampaignsWithEnrollment } from './use-get-super-campaigns-with-enrollment'

function SuperCampaignsSection() {
  const {
    superCampaignsWithEnrollment,
    setSuperCampaignsWithEnrollment,
    isLoading
  } = useGetSuperCampaignsWithEnrollment()

  const isEmpty = !isLoading && superCampaignsWithEnrollment.length === 0

  return (
    <SectionLayout title="Campaigns" gridProps={{ sm: 12 }}>
      {isEmpty && <SuperCampaignsSectionEmptyState />}
      {isLoading ? (
        <SuperCampaignsSectionLoading />
      ) : (
        <SuperCampaignCards
          superCampaignsWithEnrollment={superCampaignsWithEnrollment}
          setSuperCampaignsWithEnrollment={setSuperCampaignsWithEnrollment}
        />
      )}
    </SectionLayout>
  )
}

export default SuperCampaignsSection
