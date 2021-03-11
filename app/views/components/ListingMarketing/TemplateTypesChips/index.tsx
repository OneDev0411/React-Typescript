import React from 'react'
import { Box, Chip, Grid } from '@material-ui/core'

import { getTemplateTypeLabel } from 'utils/marketing-center/get-template-type-label'

interface Props {
  types: IMarketingTemplateType[]
  activeType?: IMarketingTemplateType
  onClick: (type: IMarketingTemplateType) => void
}

export default function TemplateTypesChips({
  types,
  activeType,
  onClick
}: Props) {
  return (
    <Grid container item>
      {types.map(type => {
        const isActive = activeType === type
        const label = getTemplateTypeLabel(type)

        return (
          <Grid item key={type}>
            <Box m={0.5}>
              <Chip
                variant="outlined"
                label={label}
                color={isActive ? 'primary' : 'default'}
                onClick={() => onClick(type)}
              />
            </Box>
          </Grid>
        )
      })}
    </Grid>
  )
}
