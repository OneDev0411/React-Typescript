import React from 'react'

import { Grid, Typography } from '@material-ui/core'

import Link from 'components/ALink'
import CardSkeleton from 'components/CardSkeleton'
import EmailInsightCard from 'components/EmailInsightCard'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

import { useEmailCampaigns } from './hooks'

export default function SentEmailsSection() {
  const { isLoading, campaigns } = useEmailCampaigns()

  return (
    <SectionLayout
      title="Sent Emails"
      actionNode={
        campaigns?.length ? (
          <LinkSectionAction
            title="View Email Insight"
            url="/dashboard/insights"
          />
        ) : null
      }
      containerGridProps={{
        sm: 6
      }}
    >
      <>
        {isLoading && (
          <>
            <Grid item xs sm={6}>
              <CardSkeleton />
            </Grid>
            <Grid item xs sm={6}>
              <CardSkeleton />
            </Grid>
          </>
        )}
        {!isLoading && (!campaigns || campaigns.length === 0) && (
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary">
              Send an eBlast and you'll be able to see who opens, and clicks on
              them.
            </Typography>
          </Grid>
        )}
        {!isLoading &&
          campaigns?.slice(0, 2).map(campaign => (
            <Grid key={campaign.id} item xs={12} sm={6}>
              <Link
                noStyle
                // eslint-disable-next-line max-len
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
