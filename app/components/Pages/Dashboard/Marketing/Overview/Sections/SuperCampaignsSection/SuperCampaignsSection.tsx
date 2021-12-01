import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import LinkSectionAction from '../LinkSectionAction'
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

  // TODO: Remove this when agents have their campaigns tab too
  const hasAdminAccess = useAcl(ACL.ADMIN)

  return (
    <SectionLayout
      title="Campaigns"
      actionNode={
        superCampaignsWithEnrollment?.length && hasAdminAccess ? (
          <LinkSectionAction
            title="All Campaigns"
            url="/dashboard/insights/super-campaign"
          />
        ) : null
      }
      containerGridProps={{ sm: 12 }}
      grayMode
    >
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
