import { useGetMySuperCampaignsWithEnrollment } from '@app/components/Pages/Dashboard/SuperCampaigns/pages/use-get-my-super-campaigns-with-enrollment'
import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

import { SUPER_CAMPAIGN_CARDS_COUNT } from './constants'
import SuperCampaignsSectionContent from './SuperCampaignsSectionContent'

function SuperCampaignsSection() {
  const { isLoading, superCampaignsWithEnrollment } =
    useGetMySuperCampaignsWithEnrollment(SUPER_CAMPAIGN_CARDS_COUNT)

  const hasBetaAccess = useAcl(ACL.BETA)

  if (!hasBetaAccess) {
    return null
  }

  const isEmpty = !isLoading && superCampaignsWithEnrollment.length === 0

  return (
    <SectionLayout
      title="Upcoming Campaigns"
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
      />
    </SectionLayout>
  )
}

export default SuperCampaignsSection
