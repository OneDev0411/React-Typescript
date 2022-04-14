import { makeStyles, Typography, Button, alpha } from '@material-ui/core'
import { mdiOpenInNew, mdiCheck } from '@mdi/js'
import classNames from 'classnames'
import timeago from 'timeago.js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { ClassesProps } from 'utils/ts-utils'

import LinkButton from '../LinkButton'
import { RelativeTime } from '../RelativeTime'

import { CARD_INNER_HEIGHT, CARD_MARGIN } from './constants'
import { localeENExtraShort } from './helpers'
import SearchResultCardImage, {
  SearchResultCardImageProps
} from './SearchResultCardImage'

timeago.register('en_extra_short', localeENExtraShort)

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
      backgroundColor: theme.palette.grey[50],
      '& $title': { color: theme.palette.common.black },
      '& $footerInner': {
        opacity: 1,
        backgroundColor: theme.palette.grey[50]
      }
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
      color: theme.palette.grey[800],
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
  { name: 'SearchResultCard' }
)

export interface SearchResultCardProps
  extends SearchResultCardImageProps,
    ClassesProps<typeof useStyles> {
  isSelected?: boolean
  overline?: string
  overlineIcon?: string
  overlineDate?: string
  title?: string
  link: string
  onSelect: () => void
}

function SearchResultCard({
  overlineIcon,
  overline,
  title,
  overlineDate,
  link,
  isSelected = false,
  onSelect,
  classes: classesProp,
  ...otherProps
}: SearchResultCardProps) {
  const classes = useStyles({ classes: classesProp })

  const hasOverlineDetail = !!(overlineIcon || overline)

  return (
    <div
      className={classNames(classes.root, isSelected && classes.rootSelected)}
    >
      <SearchResultCardImage {...otherProps} />
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
                <RelativeTime
                  // The timeago().format() method does not return a valid date for some timezones,
                  // so it needs an ISO date to works fine.
                  time={new Date(overlineDate).toISOString()}
                  locale="en_extra_short"
                />
              </Typography>
            )}
          </div>
        )}
        {title ? (
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

export default SearchResultCard
