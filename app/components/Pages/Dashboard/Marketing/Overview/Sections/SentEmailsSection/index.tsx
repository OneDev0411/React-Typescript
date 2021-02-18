import React from 'react'
import { Grid, Typography } from '@material-ui/core'

import Link from 'components/ALink'
import CardSkeleton from 'components/CardSkeleton'
import EmailInsightCard from 'components/EmailInsightCard'

import SectionLayout from '../SectionLayout'
import LinkSectionAction from '../LinkSectionAction'
import { useEmailCampaigns } from './hooks'

export default function SentEmailsSection() {
  const { isLoading, campaigns } = useEmailCampaigns()

  return (
    <SectionLayout
      title="Sent Emails"
      actionNode={
        <LinkSectionAction
          title="View email insights"
          url="/dashboard/insights"
        />
      }
    >
      <>
        {isLoading && (
          <>
            <Grid item xs sm={6} md={3}>
              <CardSkeleton />
            </Grid>
            <Grid item xs sm={6} md={3}>
              <CardSkeleton />
            </Grid>
            <Grid item xs sm={6} md={3}>
              <CardSkeleton />
            </Grid>
            <Grid item xs sm={6} md={3}>
              <CardSkeleton />
            </Grid>
          </>
        )}
        {!isLoading && !campaigns && (
          <Typography variant="h6">No campaigns to show</Typography>
        )}
        {!isLoading &&
          campaigns
            ?.filter(campaign => !!campaign.template && !!campaign.executed_at)
            .slice(0, 4)
            .map(campaign => (
              <Grid key={campaign.id} item xs sm={6} md={3}>
                <Link
                  noStyle
                  to={`/dashboard/insights/${campaign.id}?backUrl=/dashboard/marketing`}
                >
                  <EmailInsightCard campaign={campaign} />
                </Link>
              </Grid>
            ))}
      </>
    </SectionLayout>
  )
}
