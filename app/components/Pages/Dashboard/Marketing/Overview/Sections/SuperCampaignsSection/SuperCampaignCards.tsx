import { Grid } from '@material-ui/core'

import SuperCampaignWithEnrollmentCard from './SuperCampaignWithEnrollmentCard'

export interface SuperCampaignCardsProps {
  superCampaignsWithEnrollment: ISuperCampaignWithEnrollment[]
  onEnroll: (
    superCampaignId: UUID,
    enrollment: ISuperCampaignEnrollment
  ) => void
  onUnenroll: (superCampaignId: UUID) => void
}

function SuperCampaignCards({
  superCampaignsWithEnrollment,
  onEnroll,
  onUnenroll
}: SuperCampaignCardsProps) {
  return (
    <>
      {superCampaignsWithEnrollment.map(superCampaignWithEnrollment => (
        <Grid key={superCampaignWithEnrollment.id} item xs={6} sm={3}>
          <SuperCampaignWithEnrollmentCard
            superCampaignWithEnrollment={superCampaignWithEnrollment}
            onEnroll={enrollment =>
              onEnroll(superCampaignWithEnrollment.id, enrollment)
            }
            onUnenroll={() => onUnenroll(superCampaignWithEnrollment.id)}
          />
        </Grid>
      ))}
    </>
  )
}

export default SuperCampaignCards
