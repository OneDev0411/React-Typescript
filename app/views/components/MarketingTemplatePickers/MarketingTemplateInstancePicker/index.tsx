import { useState } from 'react'

import { Grid, Box, makeStyles, Typography } from '@material-ui/core'

import {
  DEFAULT_TEMPLATE_ASSOCIATIONS,
  DEFAULT_TEMPLATE_OMIT,
  useTemplatesHistory
} from '@app/components/Pages/Dashboard/Marketing/hooks/use-templates-history'
import useNotify from '@app/hooks/use-notify'
import { getTemplateInstance } from '@app/models/instant-marketing/get-template-instance'
import LoadingContainer from 'components/LoadingContainer'
import MarketingTemplateCard from 'components/MarketingTemplateCard'
import { MarketingTemplateInstancePickerProps } from 'components/MarketingTemplatePickers/types'
import Masonry from 'components/Masonry'
import { useInfinitePagination } from 'hooks/use-infinite-pagination'

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
  const notify = useNotify()
  const [isLoadingTemplateInstance, setIsLoadingTemplateInstance] =
    useState(false)
  const { templates, isLoading } = useTemplatesHistory({
    associations: DEFAULT_TEMPLATE_ASSOCIATIONS,
    omit: DEFAULT_TEMPLATE_OMIT,
    templateTypes,
    mediums
  })

  const paginatedTemplates = useInfinitePagination<IMarketingTemplateInstance>({
    items: templates,
    infiniteScrollProps: {
      container: containerRef
    }
  })

  const handleClick = async (id: UUID) => {
    // load template instance

    setIsLoadingTemplateInstance(true)

    try {
      const templateInstance = await getTemplateInstance(id)

      onSelect(templateInstance)
    } catch {
      notify({
        status: 'error',
        message: 'Could not load the template instance. Please try again.'
      })
    } finally {
      setIsLoadingTemplateInstance(false)
    }
  }

  if (isLoading) {
    return (
      <Grid container justifyContent="center">
        <LoadingContainer style={{ padding: '20%' }} noPaddings />
      </Grid>
    )
  }

  if (isLoadingTemplateInstance) {
    return (
      <Grid container justifyContent="center">
        <LoadingContainer
          style={{ padding: '20%' }}
          noPaddings
          title="Preparing template data..."
        />
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
            onClick={() => handleClick(template.id)}
          >
            <MarketingTemplateCard template={template} />
          </div>
        ))}
      </Masonry>
    </Grid>
  )
}
