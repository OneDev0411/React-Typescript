import { makeStyles, CircularProgress, Typography } from '@material-ui/core'
import classNames from 'classnames'

import { VideoThumbnail } from '../VideoThumbnail'

import { hasImageUrl, isNoImageState } from './helpers'

const useStyles = makeStyles(
  theme => ({
    root: {
      position: 'relative',
      backgroundColor: theme.palette.grey[100],
      borderRadius: theme.spacing(0.5),
      overflow: 'hidden'
    },
    item: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0
    },
    image: { objectFit: 'cover' },
    error: {
      color: theme.palette.grey[400],
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    alt: { textTransform: 'uppercase' },
    loading: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: 0,
      color: theme.palette.grey[400]
    }
  }),
  { name: 'SearchResultCardImage' }
)

export interface SearchResultCardImageProps {
  imageUrl: Optional<string>
  imageAspect: number
  imageAlt?: string
  onImageError?: () => void
}

function SearchResultCardImage({
  imageUrl,
  imageAlt,
  imageAspect,
  onImageError
}: SearchResultCardImageProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div style={{ paddingTop: `${imageAspect * 100}%` }} />
      {hasImageUrl(imageUrl) ? (
        <>
          {isNoImageState(imageUrl) ? (
            <Typography
              component="div"
              variant="caption"
              className={classNames(classes.item, classes.error)}
            >
              <div className={classes.alt}>{imageAlt}</div>
              <div>(no image)</div>
            </Typography>
          ) : imageUrl?.endsWith('mp4') ||
            imageUrl?.startsWith('data:video/mp4') ? (
            <VideoThumbnail className={classes.item} url={imageUrl} />
          ) : (
            <img
              className={classNames(classes.item, classes.image)}
              src={imageUrl}
              alt={imageAlt}
              onError={onImageError}
            />
          )}
        </>
      ) : (
        <div className={classes.loading}>
          <CircularProgress size={24} color="inherit" />
        </div>
      )}
    </div>
  )
}

export default SearchResultCardImage
