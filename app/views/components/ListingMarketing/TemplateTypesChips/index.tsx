import React from 'react'
import { Box, Chip, Grid, makeStyles, Theme } from '@material-ui/core'

import { getTemplateTypeLabel } from 'utils/marketing-center/get-template-type-label'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginBottom: theme.spacing(4)
    }
  }),
  {
    name: 'ListingMarketingTemplateTypesChips'
  }
)

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
  const classes = useStyles()

  return (
    <Grid container item className={classes.container}>
      {types.map(type => {
        const isActive = activeType === type
        const label = getTemplateTypeLabel(type)

        return (
          <Grid item key={type}>
            <Box mr={1} mb={1}>
              <Chip
                variant="default"
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
