import { Grid } from '@material-ui/core'

import { SUPER_CAMPAIGN_CARDS_COUNT } from './constants'
import SuperCampaignWithEnrollmentSkeletonCard from './SuperCampaignWithEnrollmentSkeletonCard'

const EMPTY_CARDS = new Array(SUPER_CAMPAIGN_CARDS_COUNT).fill(null)

function SuperCampaignsSectionLoading() {
  return (
    <>
      {EMPTY_CARDS.map((_, index) => (
        <Grid item xs={6} sm={3} key={index}>
          <SuperCampaignWithEnrollmentSkeletonCard />
        </Grid>
      ))}
    </>
  )
}

export default SuperCampaignsSectionLoading
