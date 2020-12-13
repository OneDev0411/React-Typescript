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
      [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(5, 0)
      }
    },
    mainImage: {
      maxHeight: 440,
      maxWidth: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '70%'
      }
    },
    subImage: {
      display: 'none',
      '& > img': {
        width: '100%',
        height: '100%'
      },
      [theme.breakpoints.up('sm')]: {
        display: 'block',
        position: 'absolute',
        width: 250,
        height: 150
      },
      [theme.breakpoints.up('md')]: {
        width: 325,
        height: 200
      },
      [theme.breakpoints.up('lg')]: {
        width: 225,
        height: 150
      }
    },
    subImageTop: {
      [theme.breakpoints.up('sm')]: {
        top: '-7%',
        left: '5%',
        boxShadow: `-3px -2px 10px ${theme.palette.grey['300']}`
      },
      [theme.breakpoints.up('lg')]: {
        top: 0,
        left: '10%',
        boxShadow: 'none'
      }
    },
    subImageBottom: {
      [theme.breakpoints.up('sm')]: {
        bottom: '-7%',
        right: '5%',
        boxShadow: `5px 7px 10px ${theme.palette.grey['300']}`
      },
      [theme.breakpoints.up('lg')]: {
        right: '10%',
        bottom: 0,
        boxShadow: 'none'
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
        <ButtonBase type="button" onClick={onClick} data-image-index={0}>
          <img
            src={featuredImages[0]}
            alt="main"
            className={classes.mainImage}
          />
        </ButtonBase>
      ) : (
        <img
          src={MAIN_IMAGE_PLACEHOLDER_SRC}
          alt="main"
          className={classes.mainImage}
        />
      )}
      {featuredImages[1] && (
        <ButtonBase
          type="button"
          onClick={onClick}
          data-image-index={1}
          className={cn(classes.subImage, classes.subImageTop)}
        >
          <img src={featuredImages[1]} alt="top" />
        </ButtonBase>
      )}
      {featuredImages[2] && (
        <ButtonBase
          type="button"
          onClick={onClick}
          data-image-index={2}
          className={cn(classes.subImage, classes.subImageBottom)}
        >
          <img src={featuredImages[2]} alt="bottom" />
        </ButtonBase>
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
