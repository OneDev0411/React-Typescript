import { Grid } from '@material-ui/core'

import MyDesignsSection from './MyDesignsSection'
import NewsletterBannerSection from './NewsletterBannerSection'
import PromoteListingsSection from './PromoteListingsSection'
import SentEmailsSection from './SentEmailsSection'
import SomethingToShareSection from './SomethingToShareSection'
import SuperCampaignsSection from './SuperCampaignsSection'
import UpcomingBirthdaysAndAnniversariesSection from './UpcomingBirthdaysAndAnniversariesSection'
import WhatsNewInMCSection from './WhatsNewInMCSection'

export default function Sections() {
  return (
    <Grid container item direction="column">
      <Grid
        container
        item
        spacing={2}
        direction="row"
        justifyContent="space-between"
      >
        <SuperCampaignsSection />
        <SentEmailsSection />
        <MyDesignsSection />
        <UpcomingBirthdaysAndAnniversariesSection />
        <PromoteListingsSection />
        <NewsletterBannerSection />
        <WhatsNewInMCSection />
        <SomethingToShareSection />
      </Grid>
    </Grid>
  )
}
