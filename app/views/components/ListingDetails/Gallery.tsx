import React, { MouseEvent, useState } from 'react'

import {
  makeStyles,
  Theme,
  useTheme,
  useMediaQuery,
  alpha
} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { mdiFullscreen } from '@mdi/js'
import cn from 'classnames'
import pluralize from 'pluralize'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import {
  PLACEHOLDER_IMAGES_BASE_URL,
  MAIN_IMAGE_PLACEHOLDER_SRC
} from './constans'
import Lightbox from './Lightbox'

const THUMBNAIL_IMAGES_PLACEHOLDER = Array.from({ length: 4 }, (x, i) => i).map(
  i => `${PLACEHOLDER_IMAGES_BASE_URL}small-0${i + 1}.jpg`
)

const useStyles = makeStyles(
  (theme: Theme) => ({
    mainImageWrapper: {
      marginBottom: theme.spacing(1),
      position: 'relative',
      [theme.breakpoints.up('lg')]: {
        marginBottom: theme.spacing(2)
      }
    },
    mainImage: {
      width: '100%',
      height: 'auto'
    },
    button: {
      backgroundColor: 'transparent',
      padding: 0,
      border: 'none',
      width: '100%',
      position: 'relative'
    },
    thumbnailsWrapper: {
      display: 'flex',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    thumbnailBtn: {
      height: '100%'
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
      maxHeight: 110,
      objectPosition: 'center',
      objectFit: 'cover'
    },
    fullscreenIcon: {
      position: 'absolute',
      left: theme.spacing(2),
      bottom: theme.spacing(2),
      padding: theme.spacing(0.5),
      borderRadius: '50%',
      background: alpha(theme.palette.common.black, 0.5),
      backdropFilter: 'blur(20px)'
    },
    photoNumbers: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: theme.palette.common.white,
      zIndex: 1,
      '&::before': {
        zIndex: -1,
        content: "''",
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        opacity: 0.5,
        backgroundColor: theme.palette.common.black
      }
    }
  }),
  { name: 'Gallery' }
)

interface Props {
  images: string[]
}

interface Thumbnails {
  src: string
  isFake: boolean
}

function Gallery({ images }: Props) {
  const theme = useTheme()
  const classes = useStyles()
  const imagesLength = images.length
  const isUpSmallBreakPoint = useMediaQuery(theme.breakpoints.up('sm'))
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const thumbnails: Thumbnails[] = React.useMemo(() => {
    if (imagesLength < 2) {
      return THUMBNAIL_IMAGES_PLACEHOLDER.map(item => ({
        src: item,
        isFake: true
      }))
    }

    if (imagesLength < 5) {
      let thumbnailsSrc: Thumbnails[] = []

      for (let i = 1; i < 5; i++) {
        const src = images[i]

        thumbnailsSrc.push({
          src: src || THUMBNAIL_IMAGES_PLACEHOLDER[i - 1],
          isFake: !src
        })
      }

      return thumbnailsSrc
    }

    return images.slice(1, 5).map(src => ({
      src,
      isFake: false
    }))
  }, [images, imagesLength])

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
          <img
            className={classes.mainImage}
            src={images[0] || MAIN_IMAGE_PLACEHOLDER_SRC}
            alt="listing"
          />
          <SvgIcon
            path={mdiFullscreen}
            size={muiIconSizes.xlarge}
            className={classes.fullscreenIcon}
            color={theme.palette.common.white}
          />
        </button>
      </Box>
      <div className={classes.thumbnailsWrapper}>
        <Grid container spacing={isUpSmallBreakPoint ? 2 : 1}>
          {thumbnails.map((item, index) => (
            <Grid item xs={3} key={index}>
              <button
                type="button"
                disabled={item.isFake}
                data-image-index={index + 1}
                className={cn(classes.button, classes.thumbnailBtn)}
                onClick={item.isFake ? () => false : openLightbox}
              >
                <img
                  className={classes.thumbnailImage}
                  src={item.src}
                  alt="listing"
                />
                {index === 3 && imagesLength > 5 && (
                  <Box className={classes.photoNumbers}>
                    <Typography variant="caption">
                      {`+ ${images.length - 5} ${pluralize(
                        'Photos',
                        images.length - 5
                      )}`}
                    </Typography>
                  </Box>
                )}
              </button>
            </Grid>
          ))}
        </Grid>
      </div>
      {imagesLength > 0 && (
        <Lightbox
          images={images}
          isOpen={isLightboxOpen}
          selectedImageIndex={selectedImageIndex}
          handleClose={closeLightbox}
        />
      )}
    </Box>
  )
}

export default Gallery
