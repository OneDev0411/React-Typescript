import React from 'react'
import { Grid, Box, Typography } from '@material-ui/core'

import LoadingContainer from 'components/LoadingContainer'
import MyDesignCard from 'components/MyDesignCard'

import { useTemplatesHistory } from '../../../hooks/use-templates-history'
import SectionLayout from '../SectionLayout'
import LinkSectionAction from '../LinkSectionAction'

export default function MyDesigns() {
  const { templates, isLoading } = useTemplatesHistory()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" flexGrow="1">
        <LoadingContainer noPaddings />
      </Box>
    )
  }

  return (
    <SectionLayout
      title="My Designs"
      actionNode={
        <LinkSectionAction
          title="View all my designs"
          url="/dashboard/marketing/designs"
        />
      }
      gridProps={{
        sm: 6
      }}
    >
      <>
        {templates.length === 0 && (
          <Typography variant="h6">No designs to show</Typography>
        )}
        {templates?.slice(0, 2).map(template => (
          <Grid key={template.id} item xs sm={6}>
            <MyDesignCard templateInstance={template} />
          </Grid>
        ))}
      </>
    </SectionLayout>
  )
}
