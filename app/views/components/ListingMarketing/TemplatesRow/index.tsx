import { memo, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Box, makeStyles, Theme } from '@material-ui/core'
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
    },
    thumbnailContainer: {
      padding: theme.spacing(1),
      overflow: 'hidden'
    }
  }),
  {
    name: 'ListingMarketingTemplatesRow'
  }
)

interface Props {
  header: ReactNode
  listing: IListing
  medium: IMarketingTemplateMedium
  templates: IBrandMarketingTemplate[]
  onClick: (template: IBrandMarketingTemplate) => void
}

function TemplatesRow({ header, listing, medium, templates, onClick }: Props) {
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
          <Box mx={1} display="flex">
            <SvgIcon size={muiIconSizes.large} path={MEDIUM_ICONS[medium]} />
          </Box>
        </Grid>
        <Grid item>{header}</Grid>
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
            <Box className={classes.thumbnailContainer}>
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
