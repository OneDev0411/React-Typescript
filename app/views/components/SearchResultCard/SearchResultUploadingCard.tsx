import { makeStyles, Typography, Button } from '@material-ui/core'
import { mdiOpenInNew } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import LinkButton from '../LinkButton'

import { CARD_INNER_HEIGHT, CARD_MARGIN } from './constants'
import SearchResultCardImage from './SearchResultCardImage'

const useStyles = makeStyles(
  theme => ({
    root: {
      margin: CARD_MARGIN,
      padding: theme.spacing(1),
      borderRadius: theme.spacing(0.5),
      height: CARD_INNER_HEIGHT,
      cursor: 'progress',
      '&:hover': { backgroundColor: theme.palette.grey[100] },
      '&:hover $title': { color: theme.palette.common.black },
      '&:hover $footerInner': {
        opacity: 1,
        backgroundColor: theme.palette.grey[100]
      }
    },
    loader: {
      position: 'relative',
      '&:before': {
        content: '""',
        width: '100%',
        height: 5,
        bottom: 0,
        left: 0,
        backgroundColor: theme.palette.grey[100],
        position: 'absolute',
        borderRadius: theme.spacing(0, 0, 0.5, 0.5),
        zIndex: 1
      },
      '&:after': {
        content: '""',
        width: ({ progressPercentage }: Pick<Props, 'progressPercentage'>) =>
          `${progressPercentage}%`,
        height: 5,
        bottom: 0,
        left: 0,
        backgroundColor: theme.palette.primary.main,
        position: 'absolute',
        zIndex: 2
      }
    },
    loaderInner: {
      opacity: ({ progressPercentage }: Pick<Props, 'progressPercentage'>) =>
        `${15 + progressPercentage / 1.5}%`
    },
    detail: { padding: theme.spacing(0, 0.5) },
    overlineIcon: {
      width: 12,
      height: 12
    },
    overlineDetail: {
      display: 'flex',
      alignItems: 'center',
      height: theme.spacing(4),
      color: theme.palette.grey[500]
    },
    overline: { margin: theme.spacing(0, 0.5) },
    title: {
      color: theme.palette.grey[800],
      '-webkit-line-clamp': 2,
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      whiteSpace: 'normal',
      minHeight: 38 // Reserve the space for two lines
    },
    footer: { position: 'relative' },
    footerInner: {
      paddingTop: theme.spacing(1),
      display: 'flex',
      justifyContent: 'space-between',
      opacity: 0,
      transition: theme.transitions.create('opacity'),
      position: 'relative'
    },
    viewIcon: {
      height: 30,
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      left: 0,
      bottom: 0,
      color: theme.palette.grey[400]
    },
    selectButton: { minWidth: theme.spacing(9) },
    viewButton: { '&:hover, &:focus': { color: theme.palette.primary.main } }
  }),
  { name: 'SearchResultCard' }
)

interface Props {
  title?: string
  imageUrl: string
  imageAspect: number
  progressPercentage: number
}

function SearchResultUploadingCard({
  title,
  imageUrl,
  imageAspect,
  progressPercentage
}: Props) {
  const classes = useStyles({ progressPercentage })

  return (
    <div className={classes.root}>
      <div className={classes.loader}>
        <div className={classes.loaderInner}>
          <SearchResultCardImage
            imageUrl={imageUrl}
            imageAspect={imageAspect}
          />
        </div>
      </div>
      <div className={classes.detail}>
        <div className={classes.overlineDetail}>
          <img
            className={classes.overlineIcon}
            src="/static/images/favicons/favicon-32x32.png"
            alt={`${progressPercentage.toFixed(2)}% uploading...`}
          />
          <Typography className={classes.overline} variant="caption" noWrap>
            {progressPercentage.toFixed(2)}%
          </Typography>
        </div>
        {title ? (
          <Typography
            className={classes.title}
            component="div"
            variant="body2"
            noWrap
          >
            {title}
          </Typography>
        ) : null}
        <div className={classes.footer}>
          <div className={classes.viewIcon}>
            <SvgIcon path={mdiOpenInNew} size={muiIconSizes.small} />
          </div>
          <div className={classes.footerInner}>
            <LinkButton
              className={classes.viewButton}
              startIcon={
                <SvgIcon path={mdiOpenInNew} size={muiIconSizes.small} />
              }
              variant="outlined"
              color="primary"
              size="small"
              target="_blank"
              disabled
            >
              View
            </LinkButton>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled
              className={classes.selectButton}
            >
              Select
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResultUploadingCard
