import React from 'react'

import { Grid, Box, Typography, makeStyles } from '@material-ui/core'

import LoadingContainer from 'components/LoadingContainer'
import MarketingTemplateCard from 'components/MarketingTemplateCard'
import { MarketingTemplateInstancePickerProps } from 'components/MarketingTemplatePickers/types'
import Masonry from 'components/Masonry'
import { useInfinitePagination } from 'hooks/use-infinite-pagination'

import { useTemplatesHistory } from '../../../../components/Pages/Dashboard/Marketing/hooks/use-templates-history'

const useStyles = makeStyles(
  () => ({
    templateItemContainer: {
      cursor: 'pointer'
    }
  }),
  {
    name: 'MarketingTemplateInstancePicker'
  }
)

export default function MarketingTemplateInstancePicker({
  templateTypes,
  mediums,
  containerRef,
  onSelect
}: MarketingTemplateInstancePickerProps) {
  const classes = useStyles()

  const { templates, isLoading } = useTemplatesHistory({
    templateTypes,
    mediums
  })

  const paginatedTemplates = useInfinitePagination<IMarketingTemplateInstance>({
    items: templates,
    infiniteScrollProps: {
      container: containerRef
    }
  })

  if (isLoading) {
    return (
      <Grid container justifyContent="center">
        <LoadingContainer style={{ padding: '20%' }} noPaddings />
      </Grid>
    )
  }

  if (!isLoading && templates.length === 0) {
    return (
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box my={2} pt={10}>
          <img
            src="/static/images/contacts/zero-state.svg"
            alt="houston"
            style={{ marginBottom: '1rem' }}
          />
        </Box>
        <Typography variant="h5" align="center">
          You don't have any templates here yet!
        </Typography>
      </Grid>
    )
  }

  return (
    <Grid container>
      <Masonry>
        {paginatedTemplates.map(template => (
          <div
            key={template.id}
            className={classes.templateItemContainer}
            onClick={() => onSelect(template)}
          >
            <MarketingTemplateCard template={template} />
          </div>
        ))}
      </Masonry>
    </Grid>
  )
}
