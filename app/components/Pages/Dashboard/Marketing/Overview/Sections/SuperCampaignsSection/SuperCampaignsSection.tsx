import { ACL } from '@app/constants/acl'
import { useGetMySuperCampaignsWithEnrollment } from '@app/hooks/use-get-my-super-campaigns-with-enrollment'
import { useAcl } from '@app/views/components/Acl/use-acl'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

import { SUPER_CAMPAIGN_CARDS_COUNT } from './constants'
import SuperCampaignsSectionContent from './SuperCampaignsSectionContent'

function SuperCampaignsSection() {
  const {
    isLoading,
    superCampaignsWithEnrollment,
    enrollToSuperCampaign,
    unenrollFromSuperCampaign
  } = useGetMySuperCampaignsWithEnrollment(SUPER_CAMPAIGN_CARDS_COUNT)

  const hasBetaAccess = useAcl(ACL.BETA)

  if (!hasBetaAccess) {
    return null
  }

  const isEmpty = !isLoading && superCampaignsWithEnrollment.length === 0

  return (
    <SectionLayout
      title="Campaigns"
      actionNode={
        superCampaignsWithEnrollment?.length ? (
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
        onEnroll={enrollToSuperCampaign}
        onUnenroll={unenrollFromSuperCampaign}
      />
    </SectionLayout>
  )
}

export default SuperCampaignsSection
