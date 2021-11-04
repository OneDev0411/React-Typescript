import { Grid } from '@material-ui/core'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

import SuperCampaignWithEnrollmentCard from './SuperCampaignWithEnrollmentCard'
import { useGetSuperCampaignsWithEnrollment } from './use-get-super-campaigns-with-enrollment'

function SuperCampaignsSection() {
  const { superCampaignsWithEnrollment } = useGetSuperCampaignsWithEnrollment()

  // TODO: Handle loading and empty state

  return (
    <SectionLayout
      title="Campaigns"
      actionNode={
        superCampaignsWithEnrollment?.length ? (
          <LinkSectionAction
            title="View all"
            url="/dashboard/insights/super-campaign"
          />
        ) : null
      }
      gridProps={{ sm: 12 }}
    >
      <Grid container spacing={2}>
        {superCampaignsWithEnrollment.map(superCampaignWithEnrollment => (
          <Grid key={superCampaignWithEnrollment.id} item sm={6}>
            <SuperCampaignWithEnrollmentCard
              superCampaignWithEnrollment={superCampaignWithEnrollment}
            />
          </Grid>
        ))}
      </Grid>
    </SectionLayout>
  )
}

export default SuperCampaignsSection
