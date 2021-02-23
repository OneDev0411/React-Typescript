import React from 'react'
import { Grid } from '@material-ui/core'

import SentEmailsSection from './SentEmailsSection'
import MyDesignsSection from './MyDesignsSection'
import PromoteListingsSection from './PromoteListingsSection'
import NewsletterBannerSection from './NewsletterBannerSection'
import UpcomingBirthdaysAndAnniversariesSection from './UpcomingBirthdaysAndAnniversariesSection'

export default function Sections() {
  return (
    <Grid container item direction="column">
      <Grid container item spacing={2} direction="row" justify="space-between">
        <SentEmailsSection />
        <MyDesignsSection />
        <UpcomingBirthdaysAndAnniversariesSection />
        <NewsletterBannerSection />
        <PromoteListingsSection />
      </Grid>
    </Grid>
  )
}
