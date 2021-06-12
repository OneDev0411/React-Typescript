import { Grid, Box, makeStyles } from '@material-ui/core'

import { ImageGalleryProps } from '../../types'

const useStyles = makeStyles(
  theme => ({
    imageContainer: {
      position: 'relative',
      width: '100%',
      paddingTop: '100%',
      border: `1px solid ${theme.palette.divider}`
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: theme.shape.borderRadius,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }),
  {
    name: 'HipPocketListingFormImageGallery'
  }
)

export default function HipPocketListingFormImageGallery({
  images
}: ImageGalleryProps) {
  const classes = useStyles()

  if (images.length === 0) {
    return null
  }

  return (
    <Grid container item>
      <Grid container item direction="row" spacing={1}>
        {images.map((image, index) => (
          <Grid item xs={4} key={index}>
            <Box className={classes.imageContainer}>
              <img src={image} alt={image} className={classes.image} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}
