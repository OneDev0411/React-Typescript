import { memo } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Box, Typography, makeStyles, Theme } from '@material-ui/core'
import {
  mdiInstagram,
  mdiLinkedin,
  mdiFacebook,
  mdiEmailOutline,
  mdiWeb,
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
  Social: mdiShareVariant,
  Website: mdiWeb
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
  medium: IMarketingTemplateMedium
  templates: IBrandMarketingTemplate[]
  onClick: (template: IBrandMarketingTemplate) => void
}

function TemplatesRow({ title, listing, medium, templates, onClick }: Props) {
  const classes = useStyles()
  const user = useSelector(selectUser)

  console.log('RENDER ROW')

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
          <Box mx={1} display="flex">
            <SvgIcon size={muiIconSizes.large} path={MEDIUM_ICONS[medium]} />
          </Box>
        </Grid>
        <Grid item>
          <Typography variant="h5" id={medium}>
            {title}
          </Typography>
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
            sm={4}
            md={2}
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

export default memo(TemplatesRow)
