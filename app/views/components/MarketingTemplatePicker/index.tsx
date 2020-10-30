import React from 'react'
import { Grid, makeStyles } from '@material-ui/core'

import { getActiveTeamId } from 'utils/user-teams'
import LoadingContainer from 'components/LoadingContainer'
import Masonry from 'components/Masonry'
import MarketingTemplateCard from 'components/MarketingTemplateCard'

import { useTemplates } from '../../../components/Pages/Dashboard/Marketing/hooks/use-templates'

const useStyles = makeStyles(
  () => ({
    templateItemCntainer: {
      cursor: 'pointer'
    }
  }),
  {
    name: 'MarketingTemplatePicker'
  }
)

interface Props {
  user: IUser
  templateTypes?: MarketingTemplateType[]
  mediums?: MarketingTemplateMedium[]
  onSelect: (template: IBrandMarketingTemplate) => void
}

export default function MarketingTemplatePicker({
  user,
  templateTypes = [],
  mediums = [],
  onSelect
}: Props) {
  const classes = useStyles()
  const activeBrand = getActiveTeamId(user)

  const { templates, isLoading } = useTemplates(
    activeBrand,
    mediums,
    templateTypes
  )

  if (isLoading) {
    return <LoadingContainer style={{ padding: '20% 0' }} />
  }

  return (
    <Grid container>
      <Masonry>
        {templates.map(template => (
          <div
            key={template.id}
            className={classes.templateItemCntainer}
            onClick={() => onSelect(template)}
          >
            <MarketingTemplateCard template={template} />
          </div>
        ))}
      </Masonry>
    </Grid>
  )
}
