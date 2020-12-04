import React, { RefObject } from 'react'
import { Grid, Box, makeStyles } from '@material-ui/core'

import { useInfinitePagination } from 'hooks/use-infinite-pagination'

import LoadingContainer from 'components/LoadingContainer'
import Masonry from 'components/Masonry'
import MarketingTemplateCard from 'components/MarketingTemplateCard'

import { useTemplatesHistory } from '../../../components/Pages/Dashboard/Marketing/hooks/use-templates-history'

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

interface Props {
  templateTypes?: IMarketingTemplateType[]
  mediums?: IMarketingTemplateMedium[]
  containerRef?: RefObject<HTMLElement>
  onSelect: (template: IMarketingTemplateInstance) => void
}

export default function MarketingTemplateInstancePicker({
  templateTypes,
  mediums,
  containerRef,
  onSelect
}: Props) {
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
        <Box py={10}>
          <LoadingContainer noPaddings />
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
