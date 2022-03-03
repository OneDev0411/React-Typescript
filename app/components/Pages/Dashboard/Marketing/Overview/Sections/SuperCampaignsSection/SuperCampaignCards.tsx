import { Grid } from '@material-ui/core'

import SuperCampaignWithEnrollmentCard from './SuperCampaignWithEnrollmentCard'

export interface SuperCampaignCardsProps {
  superCampaignsWithEnrollment: ISuperCampaignWithEnrollment[]
}

function SuperCampaignCards({
  superCampaignsWithEnrollment
}: SuperCampaignCardsProps) {
  return (
    <>
      {superCampaignsWithEnrollment.map(superCampaignWithEnrollment => (
        <Grid key={superCampaignWithEnrollment.id} item xs={6} sm={3}>
          <SuperCampaignWithEnrollmentCard
            superCampaignWithEnrollment={superCampaignWithEnrollment}
          />
        </Grid>
      ))}
    </>
  )
}

export default SuperCampaignCards
