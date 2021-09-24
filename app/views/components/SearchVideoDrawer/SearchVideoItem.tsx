import {
  ButtonBase,
  ButtonBaseProps,
  Typography,
  makeStyles
} from '@material-ui/core'
import classNames from 'classnames'

import { RelativeTime } from '../RelativeTime'

import { SearchVideoResult } from './types'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'block',
      width: '100%',
      borderRadius: theme.spacing(0.5),
      '&:hover': { backgroundColor: theme.palette.grey[200] }
    },
    holder: {
      position: 'relative',
      paddingBottom: `${Math.floor((9 / 16) * 100)}%`
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      objectFit: 'cover'
    },
    detail: {
      margin: theme.spacing(1),
      textAlign: 'left'
    },
    title: {},
    publisher: { color: theme.palette.grey[600] },
    date: { color: theme.palette.grey[500] }
  }),
  { name: 'SearchVideoItem' }
)

interface SearchVideoItemProps extends ButtonBaseProps {
  video: SearchVideoResult
}

function SearchVideoItem({
  video,
  className,
  ...otherProps
}: SearchVideoItemProps) {
  const classes = useStyles()

  return (
    <ButtonBase {...otherProps} className={classNames(classes.root, className)}>
      <div className={classes.holder}>
        <img
          className={classes.thumbnail}
          src={video.thumbnail}
          alt={video.title}
        />
      </div>
      <div className={classes.detail}>
        <Typography className={classes.title} variant="body2" noWrap>
          {video.title}
        </Typography>
        <Typography
          className={classes.publisher}
          variant="caption"
          noWrap
          component="div"
        >
          {video.publisher}
        </Typography>
        <Typography
          className={classes.date}
          variant="caption"
          noWrap
          component="div"
        >
          <RelativeTime time={video.publishedAt} />
        </Typography>
      </div>
    </ButtonBase>
  )
}

export default SearchVideoItem
