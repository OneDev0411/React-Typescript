import { useState, useCallback } from 'react'

import {
  Grid,
  Box,
  Typography,
  Fade,
  fade,
  makeStyles
} from '@material-ui/core'
import cn from 'classnames'

import { ImageGalleryProps } from '../../types'

const PAGE_SIZE = 3

const useStyles = makeStyles(
  theme => ({
    imageContainer: {
      position: 'relative',
      width: '100%',
      paddingTop: '100%',
      overflow: 'hidden',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    },
    loadMoreContainer: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      textAlign: 'center',
      color: theme.palette.common.white,
      backgroundColor: fade(theme.palette.common.black, 0.75),
      cursor: 'pointer',
      zIndex: 1,
      transition: theme.transitions.create('background-color'),

      '&:hover': {
        backgroundColor: fade(theme.palette.common.black, 0.5)
      }
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    uploadingImage: {
      opacity: 0.7
    }
  }),
  {
    name: 'HipPocketListingFormImageGallery'
  }
)

export default function HipPocketListingFormImageGallery({
  images,
  uploadingImages
}: ImageGalleryProps) {
  const classes = useStyles()
  const [loadedItemsCount, setLoadedItemsCount] = useState<number>(PAGE_SIZE)

  const isUploadingImage = useCallback(
    (url: string) => uploadingImages.includes(url),
    [uploadingImages]
  )

  const allImages = [...images, ...uploadingImages]

  if (allImages.length === 0) {
    return null
  }

  const handleClickLoadMore = () => {
    setLoadedItemsCount(Infinity)
  }

  const loadedImages = allImages.slice(0, loadedItemsCount)

  const moreImagesToShow: number = allImages.length - loadedImages.length

  return (
    <Grid container item>
      <Grid container item direction="row" spacing={1}>
        {loadedImages.map((image, index) => {
          const shouldShowLoadMore =
            moreImagesToShow > 0 && index === loadedImages.length - 1

          const isUploading = isUploadingImage(image)

          return (
            <Grid item xs={4} key={index}>
              <Fade in>
                <Box className={classes.imageContainer}>
                  {shouldShowLoadMore && (
                    <Box
                      className={classes.loadMoreContainer}
                      onClick={handleClickLoadMore}
                    >
                      <Typography variant="h6">{moreImagesToShow}</Typography>
                      <Typography variant="body2">More Photos</Typography>
                    </Box>
                  )}
                  <img
                    src={image}
                    alt={image}
                    className={cn(classes.image, {
                      [classes.uploadingImage]: isUploading
                    })}
                  />
                </Box>
              </Fade>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}
