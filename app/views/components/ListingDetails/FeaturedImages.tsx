import React from 'react'

import { Grid, makeStyles, Theme } from '@material-ui/core'
import ButtonBase from '@material-ui/core/ButtonBase'
import cn from 'classnames'

import { MAIN_IMAGE_PLACEHOLDER_SRC } from './constans'
import Lightbox from './Lightbox'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      flexWrap: 'wrap',
      [theme.breakpoints.up('md')]: {
        flexWrap: 'nowrap'
      }
    },
    imageContainer: {
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover'
    },
    lightboxButton: {
      height: '100%'
    },
    mainImageContainer: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    },
    subImagContainer: {
      width: '100%',
      height: 'auto'
    }
  }),
  { name: 'FeaturedImages' }
)

type imagesGroupSerie = 1 | 2
interface Props {
  images: string[]
  serie: imagesGroupSerie
  direction?: 'row' | 'row-reverse'
  isAgent: boolean
}

const SERIE_LENGTH = 3
const FIRST_SERIE_START_INDEX = 5
const SECOND_SERIE_START_INDEX = FIRST_SERIE_START_INDEX + SERIE_LENGTH
const FIRST_SERIE_EXTRA_ITEM_INSTEAD_OF_AGENT = 2

function FeaturedImages({ images, serie, isAgent, direction = 'row' }: Props) {
  const classes = useStyles()

  const extraItemInsteadOfAgent = isAgent
    ? 0
    : FIRST_SERIE_EXTRA_ITEM_INSTEAD_OF_AGENT
  const startIndex =
    serie === 1
      ? FIRST_SERIE_START_INDEX
      : SECOND_SERIE_START_INDEX + extraItemInsteadOfAgent
  const serieLength =
    serie === 1 ? SERIE_LENGTH + extraItemInsteadOfAgent : SERIE_LENGTH

  const featuredImages = images.slice(startIndex, startIndex + serieLength)
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
            : index + SECOND_SERIE_START_INDEX + extraItemInsteadOfAgent

        setSelectedImageIndex(imageIndexInOriginalArray)
      }
    },
    [extraItemInsteadOfAgent, serie]
  )

  return (
    <Grid
      spacing={2}
      container
      direction={direction}
      className={classes.container}
    >
      {featuredImages.length > 3 && (
        <Grid
          item
          spacing={2}
          xs={12}
          md={featuredImages.length > 4 ? 5 : 12}
          lg={featuredImages.length > 4 ? 4 : 12}
        >
          <Grid container spacing={2}>
            {featuredImages[3] && (
              <Grid item container xs={6} md={12}>
                <ButtonBase
                  className={classes.lightboxButton}
                  type="button"
                  onClick={onClick}
                  data-image-index={3}
                >
                  <img
                    className={classes.subImagContainer}
                    src={featuredImages[3]}
                    alt="feature"
                  />
                </ButtonBase>
              </Grid>
            )}
            {featuredImages[4] && (
              <Grid item xs={6} md={12}>
                <ButtonBase
                  className={classes.lightboxButton}
                  type="button"
                  onClick={onClick}
                  data-image-index={4}
                >
                  <img
                    className={classes.subImagContainer}
                    src={featuredImages[4]}
                    alt="feature"
                  />
                </ButtonBase>
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
      {featuredImages[0] ? (
        <Grid
          item
          xs={12}
          md={featuredImages.length > 1 ? 7 : 12}
          lg={featuredImages.length > 1 ? 8 : 12}
        >
          <ButtonBase
            className={classes.lightboxButton}
            type="button"
            onClick={onClick}
            data-image-index={0}
          >
            <img
              className={classes.mainImageContainer}
              src={featuredImages[0]}
              alt="feature"
            />
          </ButtonBase>
        </Grid>
      ) : (
        <div
          style={{ backgroundImage: `url(${MAIN_IMAGE_PLACEHOLDER_SRC})` }}
          className={cn(classes.imageContainer, classes.mainImageContainer)}
        />
      )}
      {featuredImages.length > 1 && (
        <Grid
          item
          spacing={2}
          xs={12}
          md={featuredImages.length > 2 ? 5 : 12}
          lg={featuredImages.length > 2 ? 4 : 12}
        >
          <Grid container spacing={2}>
            {featuredImages[1] && (
              <Grid item container xs={6} md={12}>
                <ButtonBase
                  className={classes.lightboxButton}
                  type="button"
                  onClick={onClick}
                  data-image-index={1}
                >
                  <img
                    className={classes.subImagContainer}
                    src={featuredImages[1]}
                    alt="feature"
                  />
                </ButtonBase>
              </Grid>
            )}
            {featuredImages[2] && (
              <Grid item xs={6} md={12}>
                <ButtonBase
                  className={classes.lightboxButton}
                  type="button"
                  onClick={onClick}
                  data-image-index={2}
                >
                  <img
                    className={classes.subImagContainer}
                    src={featuredImages[2]}
                    alt="feature"
                  />
                </ButtonBase>
              </Grid>
            )}
          </Grid>
        </Grid>
      )}

      {featuredImages.length > 0 && selectedImageIndex && (
        <Lightbox
          isOpen
          images={images}
          selectedImageIndex={selectedImageIndex}
          handleClose={() => setSelectedImageIndex(null)}
        />
      )}
    </Grid>
  )
}

export default FeaturedImages
