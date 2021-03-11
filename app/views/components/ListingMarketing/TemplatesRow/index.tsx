import React from 'react'
import { useSelector } from 'react-redux'
import { Grid, Box, Typography, makeStyles, Theme } from '@material-ui/core'

import { selectUser } from 'selectors/user'

import { Thumbnail as MarketingTemplateCardThumbnail } from 'components/MarketingTemplateCard/Thumbnail'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      paddingBottom: theme.spacing(2)
    }
  }),
  {
    name: 'ListingMarketingTemplatesRow'
  }
)

interface Props {
  title: string
  listing: IListing
  templates: IBrandMarketingTemplate[]
  onClick: (template: IBrandMarketingTemplate) => void
}

export default function TemplatesRow({
  title,
  listing,
  templates,
  onClick
}: Props) {
  const classes = useStyles()
  const user = useSelector(selectUser)

  return (
    <Grid container item direction="row" className={classes.container}>
      <Grid container item>
        <Typography variant="h5">{title}</Typography>
      </Grid>
      <Grid container item>
        {templates.map(template => (
          <Grid key={template.id} item xs={3}>
            <Box p={1}>
              <MarketingTemplateCardThumbnail
                user={user}
                template={template}
                listing={listing}
                onClick={() => onClick(template)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}
