import { MouseEvent } from 'react'

import { Typography, makeStyles } from '@material-ui/core'
import { mdiOpenInNew } from '@mdi/js'
import classNames from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import LinkIconButton from '../LinkIconButton'
import { RelativeTime } from '../RelativeTime'

import { SearchVideoResult } from './types'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'block',
      width: '100%',
      borderRadius: theme.spacing(0.5),
      cursor: 'pointer',
      '&:hover': { backgroundColor: theme.palette.grey[200] }
    },
    holder: {
      position: 'relative',
      paddingBottom: '56%' // 9/16 aspect ratio
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
      margin: theme.spacing(1, 1, 0, 1),
      textAlign: 'left'
    },
    publisher: { color: theme.palette.grey[600] },
    date: { color: theme.palette.grey[500] },
    view: {
      color: theme.palette.grey[500],
      '&:hover, &:focus': { color: theme.palette.primary.main }
    },
    actions: {
      padding: theme.spacing(0, 1, 1, 1),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }),
  { name: 'SearchVideoItem' }
)

interface SearchVideoItemProps {
  className?: string
  video: SearchVideoResult
  onClick: () => void
}

function SearchVideoItem({ video, className, onClick }: SearchVideoItemProps) {
  const classes = useStyles()

  const handleViewClick = (event: MouseEvent) => event.stopPropagation()

  return (
    <div className={classNames(classes.root, className)} onClick={onClick}>
      <div className={classes.holder}>
        <img
          className={classes.thumbnail}
          src={video.thumbnail}
          alt={video.title}
        />
      </div>
      <div className={classes.detail}>
        <Typography variant="body2" noWrap>
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
      </div>
      <div className={classes.actions}>
        <Typography
          className={classes.date}
          variant="caption"
          noWrap
          component="div"
        >
          <RelativeTime time={video.publishedAt} />
        </Typography>
        <LinkIconButton
          size="small"
          color="inherit"
          className={classes.view}
          to={video.url}
          target="_blank"
          onClick={handleViewClick}
        >
          <SvgIcon path={mdiOpenInNew} size={muiIconSizes.small} />
        </LinkIconButton>
      </div>
    </div>
  )
}

export default SearchVideoItem
