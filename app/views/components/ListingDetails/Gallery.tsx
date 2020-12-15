import React, { MouseEvent, useState } from 'react'
import cn from 'classnames'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme, useTheme } from '@material-ui/core'
import { mdiFullscreen } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import Lightbox from './Lightbox'

const useStyles = makeStyles(
  (theme: Theme) => ({
    mainImageWrapper: {
      marginBottom: theme.spacing(2),
      position: 'relative'
    },
    mainImage: {
      width: '100%'
    },
    thumbnailsWrapper: {
      maxWidth: '196px',
      [theme.breakpoints.up('xs')]: {
        maxWidth: '456px'
      },
      [theme.breakpoints.up('sm')]: {
        maxWidth: '744px'
      },
      [theme.breakpoints.up('md')]: {
        maxWidth: '1000px'
      }
    },
    thumbnailImage: {
      maxWidth: '100%'
    },
    button: {
      background: 'none',
      padding: 0,
      border: 'none',
      width: '100%',
      position: 'relative'
    },
    thumbnailBtn: {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    fullscreenIcon: {
      position: 'absolute',
      left: theme.spacing(4),
      bottom: theme.spacing(2)
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
  images?: string[] | null
}

function Gallery({ images }: Props) {
  const classes = useStyles()
  const theme = useTheme()
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
          <SvgIcon
            path={mdiFullscreen}
            size={muiIconSizes.large}
            className={classes.fullscreenIcon}
            color={theme.palette.common.white}
          />
        </button>
      </Box>
      <Box display="flex" justifyContent="center" px={3}>
        <Box className={classes.thumbnailsWrapper}>
          <Grid container spacing={1}>
            {images.slice(1, 5).map((src, index) => (
              <Grid item xs={3} key={index}>
                <button
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
                  {index === 3 && (
                    <Box className={classes.photoNumbers}>
                      <Typography variant="caption">
                        {`+ ${images.length - 5} Photos`}
                      </Typography>
                    </Box>
                  )}
                </button>
              </Grid>
            ))}
          </Grid>
        </Box>
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
