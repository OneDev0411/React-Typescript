import React from 'react'
import { useSelector } from 'react-redux'
import { Grid, Box, Typography, makeStyles, Theme } from '@material-ui/core'
import {
  mdiInstagram,
  mdiLinkedin,
  mdiFacebook,
  mdiEmailOutline,
  mdiPrinter,
  mdiShareVariant
} from '@mdi/js'

import { selectUser } from 'selectors/user'

import { Thumbnail as MarketingTemplateCardThumbnail } from 'components/MarketingTemplateCard/Thumbnail'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const MEDIUM_ICONS: Record<IMarketingTemplateMedium, string> = {
  InstagramStory: mdiInstagram,
  Email: mdiEmailOutline,
  LinkedInCover: mdiLinkedin,
  FacebookCover: mdiFacebook,
  Letter: mdiPrinter,
  Social: mdiShareVariant
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginBottom: theme.spacing(6)
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
    <Grid
      container
      item
      spacing={2}
      direction="row"
      className={classes.container}
    >
      <Grid container item direction="row" alignItems="center">
        <Grid item>
          <Box mx={1}>
            <SvgIcon
              size={muiIconSizes.large}
              path={MEDIUM_ICONS[templates[0].template.medium]}
            />
          </Box>
        </Grid>
        <Grid item>
          <Typography variant="h5">{title}</Typography>
        </Grid>
      </Grid>
      <Grid container item>
        {templates.map(template => (
          <Grid
            key={template.id}
            container
            item
            justify="center"
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <Box p={1} overflow="hidden">
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
