import React from 'react'
import { Grid, Box, makeStyles } from '@material-ui/core'

import { useInfinitePagination } from 'hooks/use-infinite-pagination'

import LoadingContainer from 'components/LoadingContainer'
import Masonry from 'components/Masonry'
import MarketingTemplateCard from 'components/MarketingTemplateCard'
import { MarketingTemplateInstancePickerProps } from 'components/MarketingTemplatePickers/types'

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
      <Grid container justify="center">
        <LoadingContainer style={{ padding: '20%' }} noPaddings />
      </Grid>
    )
  }

  if (!isLoading && templates.length === 0) {
    return (
      <Grid container alignItems="center" justify="center">
        <Box my={2}>
          <img
            src="/static/images/contacts/zero-state.svg"
            alt="houston"
            style={{ marginBottom: '1rem' }}
          />
        </Box>
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
