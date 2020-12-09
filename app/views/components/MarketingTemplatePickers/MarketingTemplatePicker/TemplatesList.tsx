import React from 'react'
import { Box, Grid, makeStyles } from '@material-ui/core'

import { useInfinitePagination } from 'hooks/use-infinite-pagination'
import { getActiveTeamId } from 'utils/user-teams'

import LoadingContainer from 'components/LoadingContainer'
import Masonry from 'components/Masonry'
import MarketingTemplateCard from 'components/MarketingTemplateCard'
import { MarketingTemplatePickerProps } from 'components/MarketingTemplatePickers/types'

import { useTemplates } from '../../../../components/Pages/Dashboard/Marketing/hooks/use-templates'

const useStyles = makeStyles(
  () => ({
    templateItemContainer: {
      cursor: 'pointer'
    }
  }),
  {
    name: 'TemplatesList'
  }
)

export default function TemplatesList({
  user,
  templateTypes,
  mediums = [],
  containerRef,
  onSelect
}: MarketingTemplatePickerProps) {
  const classes = useStyles()
  const activeBrand = getActiveTeamId(user)

  const { templates, isLoading } = useTemplates(
    activeBrand,
    mediums,
    templateTypes
  )

  const paginatedTemplates = useInfinitePagination<IBrandMarketingTemplate>({
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
