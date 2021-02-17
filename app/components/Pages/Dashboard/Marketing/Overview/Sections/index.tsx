import React from 'react'
import { useSelector } from 'react-redux'
import { Grid } from '@material-ui/core'

import { selectUser } from 'selectors/user'
import { hasUserAccessToAgentNetwork } from 'utils/user-teams'

import SentEmailsSection from './SentEmailsSection'
import MyDesignsSection from './MyDesignsSection'
import PromoteListingsSection from './PromoteListingsSection'
import NewsletterBannerSection from './NewsletterBannerSection'
// import UpcomingCelebrationsSection from './UpcomingCelebrationsSection'

export default function Sections() {
  const user = useSelector(selectUser)
  const hasAgentNetworkAccess = hasUserAccessToAgentNetwork(user)

  return (
    <Grid container item direction="column">
      <Grid container item spacing={2} direction="row" justify="space-between">
        <SentEmailsSection />
        <MyDesignsSection />
        {/* <UpcomingCelebrationsSection /> */}
        <NewsletterBannerSection />
        {hasAgentNetworkAccess && <PromoteListingsSection />}
      </Grid>
    </Grid>
  )
}
