import { Grid } from '@material-ui/core'

import MyDesignsSection from './MyDesignsSection'
import NewsletterBannerSection from './NewsletterBannerSection'
import PromoteListingsSection from './PromoteListingsSection'
import SentEmailsSection from './SentEmailsSection'
import SomethingToShareSection from './SomethingToShareSection'
import SuperCampaignsSection from './SuperCampaignsSection'
import UpcomingBirthdaysAndAnniversariesSection from './UpcomingBirthdaysAndAnniversariesSection'
import WhatsNewInMCSection from './WhatsNewInMCSection'

// Temporary remove this section until we have better ones
// https://gitlab.com/rechat/web/-/issues/6607
const SHOULD_SHOW_WHATS_NEW_SECTION = false
const SHOULD_SHOW_SOMETHING_TO_SHARE_SECTION = false

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
        {SHOULD_SHOW_WHATS_NEW_SECTION && <WhatsNewInMCSection />}
        {SHOULD_SHOW_SOMETHING_TO_SHARE_SECTION && <SomethingToShareSection />}
      </Grid>
    </Grid>
  )
}
