import { ACL } from '@app/constants/acl'
import { useGetMySuperCampaignsWithEnrollment } from '@app/hooks/use-get-my-super-campaigns-with-enrollment'
import { useAcl } from '@app/views/components/Acl/use-acl'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

import { SUPER_CAMPAIGN_CARDS_COUNT } from './constants'
import SuperCampaignsSectionContent from './SuperCampaignsSectionContent'

function SuperCampaignsSection() {
  const {
    superCampaignsWithEnrollment,
    setSuperCampaignsWithEnrollment,
    isLoading
  } = useGetMySuperCampaignsWithEnrollment(SUPER_CAMPAIGN_CARDS_COUNT)

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
