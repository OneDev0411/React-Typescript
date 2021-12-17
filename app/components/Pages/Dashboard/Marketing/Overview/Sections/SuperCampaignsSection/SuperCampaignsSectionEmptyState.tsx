import { Grid, Typography } from '@material-ui/core'

function SuperCampaignsSectionEmptyState() {
  return (
    <Grid item xs={12}>
      <Typography variant="body1" color="textSecondary">
        There are no campaigns.
      </Typography>
    </Grid>
  )
}

export default SuperCampaignsSectionEmptyState
