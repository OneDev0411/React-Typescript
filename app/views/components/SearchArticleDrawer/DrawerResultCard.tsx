import {
  makeStyles,
  Typography,
  Button,
  CircularProgress,
  alpha
} from '@material-ui/core'
import { mdiOpenInNew, mdiCheck } from '@mdi/js'
import classNames from 'classnames'
import timeago from 'timeago.js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import LinkButton from '../LinkButton'
import { RelativeTime } from '../RelativeTime'

import { hasImageUrl, localeENExtraShort } from './helpers'

timeago.register('en_extra_short', localeENExtraShort)

const CARD_MARGIN = 1
const CARD_INNER_HEIGHT = 235
export const CARD_HEIGHT = CARD_INNER_HEIGHT + CARD_MARGIN * 2

const useStyles = makeStyles(
  theme => ({
    root: {
      margin: CARD_MARGIN,
      padding: theme.spacing(1),
      borderRadius: theme.spacing(0.5),
      height: CARD_INNER_HEIGHT,
      '&:hover': { backgroundColor: theme.palette.grey[100] },
      '&:hover $title': { color: theme.palette.common.black },
      '&:hover $footerInner': {
        opacity: 1,
        backgroundColor: theme.palette.grey[100]
      }
    },
    rootSelected: {
      boxShadow: `inset 0 0 0 2px ${
        theme.palette.info.main
      }, 0px 2px 2px ${alpha(theme.palette.common.black, 0.1)}`,
      backgroundColor: theme.palette.info.ultralight,
      '& $title': { color: theme.palette.common.black },
      '& $footerInner': {
        opacity: 1,
        backgroundColor: theme.palette.info.ultralight
      }
    },
    imageHolder: {
      position: 'relative',
      backgroundColor: theme.palette.grey[200],
      borderRadius: theme.spacing(0.5),
      overflow: 'hidden'
    },
    image: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      objectFit: 'cover',
      color: theme.palette.grey[400],
      ...theme.typography.caption,
      '&::before': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '50%',
        backgroundColor: theme.palette.grey[200],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        textTransform: 'uppercase',
        content: 'attr(alt)'
      },
      '&::after': {
        content: '"(no image)"',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
        backgroundColor: theme.palette.grey[200],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }
    },
    loading: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: 0,
      color: theme.palette.grey[400]
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
    overlineDate: {
      display: 'flex',
      alignItems: 'center',
      '&:before': {
        display: 'inline-block',
        content: '""',
        width: 2,
        height: 2,
        backgroundColor: theme.palette.grey[400],
        borderRadius: '50%',
        marginRight: theme.spacing(0.5)
      }
    },
    title: {
      color: theme.palette.grey[700],
      '-webkit-line-clamp': 2,
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      whiteSpace: 'normal',
      minHeight: 38 // Reserve the space for two lines
    },
    titleMargin: { marginTop: theme.spacing(1) },
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
  { name: 'DrawerResultCard' }
)

export interface DrawerResultCardProps {
  imageUrl: Optional<string>
  imageAspect: number
  isSelected: boolean
  overline?: string
  overlineIcon?: string
  overlineDate?: string
  title: string
  link: string
  onSelect: () => void
  onImageError?: () => void
}

function DrawerResultCard({
  imageUrl,
  imageAspect,
  overlineIcon,
  overline,
  title,
  overlineDate,
  link,
  isSelected,
  onSelect,
  onImageError
}: DrawerResultCardProps) {
  const classes = useStyles()

  const hasOverlineDetail = !!(overlineIcon || overline)

  return (
    <div
      className={classNames(classes.root, isSelected && classes.rootSelected)}
    >
      <div className={classes.imageHolder}>
        <div style={{ paddingTop: `${imageAspect * 100}%` }} />
        {hasImageUrl(imageUrl) ? (
          <img
            className={classes.image}
            src={imageUrl}
            alt={overline}
            onError={onImageError}
          />
        ) : (
          <div className={classes.loading}>
            <CircularProgress size={24} color="inherit" />
          </div>
        )}
      </div>
      <div className={classes.detail}>
        {hasOverlineDetail && (
          <div className={classes.overlineDetail}>
            <img
              className={classes.overlineIcon}
              src={overlineIcon}
              alt={overline}
            />
            <Typography className={classes.overline} variant="caption" noWrap>
              {overline}
            </Typography>
            {overlineDate && (
              <Typography className={classes.overlineDate} variant="caption">
                <RelativeTime time={overlineDate} locale="en_extra_short" />
              </Typography>
            )}
          </div>
        )}
        <Typography
          className={classNames(
            classes.title,
            !hasOverlineDetail && classes.titleMargin
          )}
          component="div"
          variant="body2"
          noWrap
        >
          {title}
        </Typography>
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
              to={link}
              target="_blank"
            >
              View
            </LinkButton>
            <Button
              startIcon={
                isSelected && (
                  <SvgIcon path={mdiCheck} size={muiIconSizes.small} />
                )
              }
              variant={isSelected ? 'text' : 'contained'}
              color="primary"
              size="small"
              onClick={onSelect}
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

export default DrawerResultCard
