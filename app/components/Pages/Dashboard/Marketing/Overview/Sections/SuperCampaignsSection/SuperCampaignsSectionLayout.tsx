import { useGetMySuperCampaignsWithEnrollment } from '@app/components/Pages/Dashboard/SuperCampaigns/hooks/use-get-my-super-campaigns-with-enrollment'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

import { SUPER_CAMPAIGN_CARDS_COUNT } from './constants'
import SuperCampaignsSectionContent from './SuperCampaignsSectionContent'

function SuperCampaignsSectionLayout() {
  const { isLoading, superCampaignsWithEnrollment } =
    useGetMySuperCampaignsWithEnrollment(SUPER_CAMPAIGN_CARDS_COUNT)

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

export default SuperCampaignsSectionLayout
