import React from 'react'
import { Grid } from '@material-ui/core'

import { getActiveTeamId } from 'utils/user-teams'
import LoadingContainer from 'components/LoadingContainer'
import Masonry from 'components/Masonry'
import MarketingTemplateCard from 'components/MarketingTemplateCard'

import { useTemplates } from '../../../components/Pages/Dashboard/Marketing/hooks/use-templates'

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
  const activeBrand = getActiveTeamId(user)

  const { templates, isLoading } = useTemplates(
    activeBrand,
    mediums,
    templateTypes
  )

  if (isLoading) {
    return <LoadingContainer />
  }

  return (
    <Grid container>
      <Masonry>
        {templates.map(template => (
          <div key={template.id} onClick={() => onSelect(template)}>
            <MarketingTemplateCard template={template} />
          </div>
        ))}
      </Masonry>
    </Grid>
  )
}
