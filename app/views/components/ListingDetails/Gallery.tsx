import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles, Theme } from '@material-ui/core'

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
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: '70px',
      height: '48px'
    }
  }),
  { name: 'Gallery' }
)

interface Props {
  images?: string[] | null
}

function Gallery({ images }: Props) {
  const classes = useStyles()

  if (!images) {
    return null
  }

  return (
    <Box>
      <Box className={classes.mainImageWrapper} mb={3}>
        <img src={images[0]} alt="listing 1" className={classes.mainImage} />
      </Box>
      <Box px={3}>
        {images.slice(1, 5).map((src, index) => (
          <img
            src={src}
            key={index}
            alt={`listing ${index}`}
            className={classes.thumbnailImage}
          />
        ))}
      </Box>
    </Box>
  )
}

export default Gallery
