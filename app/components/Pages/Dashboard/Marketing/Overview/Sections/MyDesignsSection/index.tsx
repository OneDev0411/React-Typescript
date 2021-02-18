import React from 'react'
import { Grid, Typography } from '@material-ui/core'

import CardSkeleton from 'components/CardSkeleton'
import MyDesignCard from 'components/MyDesignCard'

import { useTemplatesHistory } from '../../../hooks/use-templates-history'
import SectionLayout from '../SectionLayout'
import LinkSectionAction from '../LinkSectionAction'

export default function MyDesignsSection() {
  const { templates, isLoading } = useTemplatesHistory()

  return (
    <SectionLayout
      title="My Designs"
      actionNode={
        <LinkSectionAction
          title="View all my designs"
          url="/dashboard/marketing/designs"
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
        {!isLoading && templates.length === 0 && (
          <Typography variant="h6">No designs to show</Typography>
        )}
        {!isLoading &&
          templates?.slice(0, 4).map(template => (
            <Grid key={template.id} item xs sm={6} md={3}>
              <MyDesignCard templateInstance={template} />
            </Grid>
          ))}
      </>
    </SectionLayout>
  )
}
