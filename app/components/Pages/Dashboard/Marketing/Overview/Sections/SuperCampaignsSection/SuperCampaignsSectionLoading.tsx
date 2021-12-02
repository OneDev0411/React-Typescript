import { Grid } from '@material-ui/core'

import SuperCampaignWithEnrollmentSkeletonCard from './SuperCampaignWithEnrollmentSkeletonCard'

const EMPTY_CARDS = new Array(4).fill(null)

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
