import React from 'react'
import cn from 'classnames'
import Box from '@material-ui/core/Box'
import ButtonBase from '@material-ui/core/ButtonBase'
import { makeStyles, Theme } from '@material-ui/core'

import { MAIN_IMAGE_PLACEHOLDER_SRC } from './constans'
import Lightbox from './Lightbox'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      textAlign: 'center',
      position: 'relative',
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        maxWidth: 800,
        margin: '0 auto',
        padding: theme.spacing(8, 0)
      }
    },
    imageContainer: {
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover'
    },
    mainImageContainer: {
      height: 240,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        height: 365,
        maxWidth: 560
      },
      [theme.breakpoints.up('lg')]: {
        height: 440
      },
      [theme.breakpoints.up('xl')]: {
        maxWidth: 600
      }
    },
    subImagContainer: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
        position: 'absolute'
      }
    },
    subImageTop: {
      width: 200,
      height: 245,
      [theme.breakpoints.up('sm')]: {
        top: 0,
        left: 0
      },
      [theme.breakpoints.up('lg')]: {
        left: theme.spacing(6)
      }
    },
    subImageBottom: {
      width: 240,
      height: 240,
      [theme.breakpoints.up('sm')]: {
        bottom: 0,
        right: 0
      },
      [theme.breakpoints.up('lg')]: {
        width: 280,
        height: 280
      }
    }
  }),
  { name: 'FeaturedImages' }
)

type imagesGroupSerie = 1 | 2
interface Props {
  images: string[]
  serie: imagesGroupSerie
}

const SERIE_LENGTH = 3
const FIRST_SERIE_START_INDEX = 5
const SECOND_SERIE_START_INDEX = FIRST_SERIE_START_INDEX + SERIE_LENGTH

function FeaturedImages({ images, serie }: Props) {
  const classes = useStyles()
  const startIndex =
    serie === 1 ? FIRST_SERIE_START_INDEX : SECOND_SERIE_START_INDEX
  const featuredImages = images.slice(startIndex, startIndex + SERIE_LENGTH)
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<
    null | number
  >(null)

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const index = Number(event.currentTarget.dataset.imageIndex)

      if (!Number.isNaN(index)) {
        const imageIndexInOriginalArray =
          serie === 1
            ? index + FIRST_SERIE_START_INDEX
            : index + SECOND_SERIE_START_INDEX

        setSelectedImageIndex(imageIndexInOriginalArray)
      }
    },
    [serie]
  )

  return (
    <Box className={classes.container}>
      {featuredImages[0] ? (
        <ButtonBase
          type="button"
          onClick={onClick}
          data-image-index={0}
          style={{ backgroundImage: `url(${featuredImages[0]})` }}
          className={cn(classes.imageContainer, classes.mainImageContainer)}
        />
      ) : (
        <div
          style={{ backgroundImage: `url(${MAIN_IMAGE_PLACEHOLDER_SRC})` }}
          className={cn(classes.imageContainer, classes.mainImageContainer)}
        />
      )}
      {featuredImages[1] && (
        <ButtonBase
          type="button"
          onClick={onClick}
          data-image-index={1}
          className={cn(
            classes.imageContainer,
            classes.subImagContainer,
            classes.subImageTop
          )}
          style={{ backgroundImage: `url(${featuredImages[1]})` }}
        />
      )}
      {featuredImages[2] && (
        <ButtonBase
          type="button"
          onClick={onClick}
          data-image-index={2}
          className={cn(
            classes.imageContainer,
            classes.subImagContainer,
            classes.subImageBottom
          )}
          style={{ backgroundImage: `url(${featuredImages[2]})` }}
        />
      )}
      {featuredImages.length > 0 && selectedImageIndex && (
        <Lightbox
          isOpen
          images={images}
          selectedImageIndex={selectedImageIndex}
          handleClose={() => setSelectedImageIndex(null)}
        />
      )}
    </Box>
  )
}

export default FeaturedImages
