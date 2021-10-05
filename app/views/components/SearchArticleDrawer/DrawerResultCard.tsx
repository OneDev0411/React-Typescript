import {
  makeStyles,
  Typography,
  Button,
  CircularProgress
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

const useStyles = makeStyles(
  theme => ({
    root: { border: `1px solid ${theme.palette.common.white}` },
    inner: {
      padding: theme.spacing(1),
      border: `2px solid ${theme.palette.common.white}`,
      borderRadius: theme.spacing(0.5),
      '&:hover': { backgroundColor: theme.palette.grey[100] },
      '&:hover $title': { color: theme.palette.common.black },
      '&:hover $footerInner': { opacity: 1 }
    },
    innerSelected: {
      borderColor: theme.palette.info.main,
      backgroundColor: theme.palette.info.ultralight,
      '& $title': { color: theme.palette.common.black }
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
      whiteSpace: 'normal'
    },
    titleMargin: { marginTop: theme.spacing(1) },
    footer: { position: 'relative' },
    footerInner: {
      paddingTop: theme.spacing(0.5),
      display: 'flex',
      justifyContent: 'space-between',
      opacity: 0,
      transition: theme.transitions.create('opacity')
    },
    footerInnerSelected: { opacity: 1 },
    viewIcon: {
      height: 30,
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      left: 0,
      bottom: 0,
      color: theme.palette.grey[400]
    },
    selectButton: { minWidth: theme.spacing(9) }
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
  onSelect
}: DrawerResultCardProps) {
  const classes = useStyles()

  const hasOverlineDetail = !!(overlineIcon || overline)

  return (
    <div className={classes.root}>
      <div
        className={classNames(
          classes.inner,
          isSelected && classes.innerSelected
        )}
      >
        <div className={classes.imageHolder}>
          <div style={{ paddingTop: `${imageAspect * 100}%` }} />
          {hasImageUrl(imageUrl) ? (
            <img className={classes.image} src={imageUrl} alt={overline} />
          ) : (
            <div className={classes.loading}>
              <CircularProgress size={24} color="inherit" />
            </div>
          )}
        </div>
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
          <div
            className={classNames(
              classes.footerInner,
              isSelected && classes.footerInnerSelected
            )}
          >
            <LinkButton
              startIcon={
                <SvgIcon path={mdiOpenInNew} size={muiIconSizes.small} />
              }
              variant="contained"
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
              variant={isSelected ? 'text' : 'outlined'}
              color="secondary"
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
