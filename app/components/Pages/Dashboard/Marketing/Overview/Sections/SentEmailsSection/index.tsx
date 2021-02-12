import React from 'react'
import { Grid, Box, Typography } from '@material-ui/core'

import Link from 'components/ALink'
import LoadingContainer from 'components/LoadingContainer'
import EmailInsightCard from 'components/EmailInsightCard'

import SectionLayout from '../SectionLayout'
import LinkSectionAction from '../LinkSectionAction'
import { useEmailCampaigns } from './hooks'

export default function SentEmailsSection() {
  const { isLoading, campaigns } = useEmailCampaigns()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" flexGrow="1">
        <LoadingContainer noPaddings />
      </Box>
    )
  }

  return (
    <SectionLayout
      title="Sent Emails"
      actionNode={
        <LinkSectionAction
          title="View email insights"
          url="/dashboard/insights"
        />
      }
      gridProps={{
        sm: 6
      }}
    >
      <>
        {!campaigns && (
          <Typography variant="h6">No campaigns to show</Typography>
        )}
        {campaigns
          ?.filter(campaign => !!campaign.template && !!campaign.executed_at)
          .slice(0, 2)
          .map(campaign => (
            <Grid key={campaign.id} item xs sm={6}>
              <Link noStyle to={`/dashboard/insights/${campaign.id}`}>
                <EmailInsightCard campaign={campaign} />
              </Link>
            </Grid>
          ))}
      </>
    </SectionLayout>
  )
}
