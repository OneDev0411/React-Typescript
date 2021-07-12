import { memo, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Box, Button, makeStyles, Theme } from '@material-ui/core'
import {
  mdiInstagram,
  mdiLinkedin,
  mdiFacebook,
  mdiEmailOutline,
  mdiWeb,
  mdiPrinter,
  mdiShareVariant,
  mdiChevronDown
} from '@mdi/js'
import pluralize from 'pluralize'

import { selectUser } from '@app/selectors/user'

import { Thumbnail } from '@app/views/components/MarketingTemplateCard/Thumbnail'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'

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
      marginBottom: theme.spacing(10),
      position: 'relative'
    },
    templatesListContainerCollapsed: {
      maxHeight: 300,
      overflowY: 'hidden',
      borderBottom: `1px solid ${theme.palette.divider}`,
      position: 'relative',
      '&::after': {
        position: 'absolute',
        content: "''",
        bottom: 0,
        left: 0,
        width: '100%',
        pointerEvents: 'none',
        boxShadow: theme.shadows[8]
      }
    },
    expandButtonContainer: {
      position: 'absolute',
      zIndex: theme.zIndex.gridAction,
      bottom: theme.spacing(-9),
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none'
    },
    expandButton: {
      pointerEvents: 'initial'
    },
    thumbnailContainer: {
      marginRight: theme.spacing(6),
      marginBottom: theme.spacing(6),
      overflow: 'hidden',
      height: 'fit-content',
      boxShadow: theme.shadows[2],
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    }
  }),
  {
    name: 'ListingMarketingTemplatesList'
  }
)

interface Props {
  header: ReactNode
  listing: IListing
  medium: IMarketingTemplateMedium
  mediumLabel: string
  templates: IBrandMarketingTemplate[]
  isExpanded: boolean
  onExpandClick: () => void
  onClick: (template: IBrandMarketingTemplate) => void
}

function TemplatesList({
  header,
  listing,
  medium,
  mediumLabel,
  templates,
  isExpanded,
  onExpandClick,
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
          <Box mx={1} display="flex">
            <SvgIcon size={muiIconSizes.large} path={MEDIUM_ICONS[medium]} />
          </Box>
        </Grid>
        <Grid item>{header}</Grid>
      </Grid>
      <Grid
        container
        item
        className={
          isExpanded ? undefined : classes.templatesListContainerCollapsed
        }
      >
        {templates.map(template => (
          <Grid
            key={template.id}
            container
            item
            justify="flex-start"
            xs={12}
            sm={6}
            md={3}
          >
            <Box className={classes.thumbnailContainer}>
              <Thumbnail
                user={user}
                template={template}
                listing={listing}
                onClick={() => onClick(template)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      {!isExpanded && (
        <div className={classes.expandButtonContainer}>
          <Button
            variant="text"
            color="default"
            size="small"
            className={classes.expandButton}
            onClick={onExpandClick}
          >
            <Grid container direction="column">
              <Grid item>Show More {pluralize(mediumLabel)}</Grid>
              <Grid item>
                <SvgIcon path={mdiChevronDown} />
              </Grid>
            </Grid>
          </Button>
        </div>
      )}
    </Grid>
  )
}

export default memo(TemplatesList)
