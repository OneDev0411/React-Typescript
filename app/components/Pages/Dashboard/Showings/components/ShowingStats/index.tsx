import { Grid } from '@material-ui/core'

import ShowingStatsCard from './ShowingStatsCard'

function ShowingStats() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <ShowingStatsCard count={43} label="Total visits this month" />
      </Grid>
    </Grid>
  )
}

export default ShowingStats
