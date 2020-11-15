import React, { MouseEvent, useState } from 'react'
import cn from 'classnames'
import Box from '@material-ui/core/Box'
import { makeStyles, Theme } from '@material-ui/core'

import Lightbox from './Lightbox'

const useStyles = makeStyles(
  (theme: Theme) => ({
    mainImageWrapper: {
      marginBottom: theme.spacing(2),
      position: 'relative'
    },
    mainImage: {
      maxWidth: '100%'
    },
    thumbnailImage: {
      width: '70px',
      height: '48px'
    },
    button: {
      background: 'none',
      padding: 0,
      border: 'none'
    },
    thumbnailBtn: {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2)
    }
  }),
  { name: 'Gallery' }
)

interface Props {
  images?: string[] | null
}

function Gallery({ images }: Props) {
  const classes = useStyles()
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!images) {
    return null
  }

  const openLightbox = (evt: MouseEvent<HTMLButtonElement>) => {
    const imageIndex = Number(evt.currentTarget.dataset.imageIndex)

    setIsLightboxOpen(true)
    setSelectedImageIndex(imageIndex)
  }
  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setSelectedImageIndex(0)
  }

  return (
    <Box>
      <Box className={classes.mainImageWrapper} mb={3}>
        <button
          type="button"
          data-image-index={0}
          className={classes.button}
          onClick={openLightbox}
        >
          <img src={images[0]} alt="listing 1" className={classes.mainImage} />
        </button>
      </Box>
      <Box px={3}>
        {images.slice(1, 5).map((src, index) => (
          <button
            key={index}
            type="button"
            data-image-index={index + 1}
            className={cn(classes.button, classes.thumbnailBtn)}
            onClick={openLightbox}
          >
            <img
              src={src}
              alt={`listing ${index}`}
              className={classes.thumbnailImage}
            />
          </button>
        ))}
      </Box>
      <Lightbox
        images={images}
        isOpen={isLightboxOpen}
        selectedImageIndex={selectedImageIndex}
        handleClose={closeLightbox}
      />
    </Box>
  )
}

export default Gallery
