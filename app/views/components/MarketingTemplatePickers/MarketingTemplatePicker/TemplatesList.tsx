import { Box, Grid, Typography, makeStyles } from '@material-ui/core'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import LoadingContainer from 'components/LoadingContainer'
import MarketingTemplateCard from 'components/MarketingTemplateCard'
import { MarketingTemplatePickerProps } from 'components/MarketingTemplatePickers/types'
import Masonry from 'components/Masonry'
import { useInfinitePagination } from 'hooks/use-infinite-pagination'

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
  templateTypes,
  mediums = [],
  containerRef,
  onSelect
}: MarketingTemplatePickerProps) {
  const classes = useStyles()
  const activeBrandId = useActiveBrandId()

  const { templates, isLoading } = useTemplates(
    activeBrandId,
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
