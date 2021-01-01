import React from 'react'
import { Grid } from '@material-ui/core'

import SiteCardItem from '../SiteCardItem'

function WebsiteListItems() {
  return (
    <Grid container spacing={2}>
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
      <SiteCardItem />
    </Grid>
  )
}

export default WebsiteListItems
