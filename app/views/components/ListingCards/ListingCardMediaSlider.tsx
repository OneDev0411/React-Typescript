import React, { CSSProperties, memo } from 'react'

import { alpha, makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'
import { Navigation, Lazy } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

const PLACEHOLDER_IMAGE = '/static/images/logo--gray.svg'

function getListingImages(imagesURL: Nullable<string[]>): string[] {
  return imagesURL && imagesURL.length ? imagesURL : [PLACEHOLDER_IMAGE]
}

function getListingImageObjectFit(
  imagesURL: Nullable<string[]>
): CSSProperties['objectFit'] {
  return imagesURL && imagesURL.length > 0 ? 'cover' : 'none'
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    image: ({ imagesURL }: Pick<Props, 'imagesURL'>) => ({
      height: 200,
      width: '100%',
      objectFit: getListingImageObjectFit(imagesURL),
      backgroundColor: theme.palette.grey[100]
    }),
    placeHolder: {
      height: 200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    swiper: {
      height: 200,
      '& .swiper-slide': {
        '-webkit-transform': 'translate3d(0, 0, 0)',
        '-webkit-backface-visibility': 'hidden'
      },
      '--swiper-navigation-color': '#fff',
      '--swiper-navigation-size': theme.spacing(2),
      // Had to add more clickable area
      // For `.swiper-button-prev` and `.swiper-button-next`
      '& > div[class^="swiper-button"]': {
        top: `calc(50% - ${theme.spacing(3)}px)`,
        filter: `drop-shadow(0px 0.3px 0.5px ${alpha(
          theme.palette.common.black,
          0.1
        )}) drop-shadow(0px 2px 4px ${alpha(theme.palette.common.black, 0.3)})`
      },
      '& > .swiper-button-prev': {
        padding: theme.spacing(4, 3, 4, 1)
      },
      '& > .swiper-button-next': {
        padding: theme.spacing(4, 1, 4, 3)
      }
    }
  }),
  {
    name: 'ListingCardMediaSlider'
  }
)

interface Props {
  imagesURL: Nullable<string[]>
}

function ListingCardMediaSlider({ imagesURL }: Props) {
  const images = getListingImages(imagesURL)

  const classes = useStyles({ imagesURL })

  return (
    <>
      {images.length > 1 ? (
        <Swiper
          height={200}
          modules={[Navigation, Lazy]}
          lazy
          navigation
          className={classes.swiper}
          preloadImages={false}
        >
          {images.map((image, index) => (
            // we have images with identical names so we can't use only image as key
            <SwiperSlide key={`${index}-${image}`}>
              <img
                className={cn('swiper-lazy', classes.image)}
                data-src={image}
                alt=""
              />
              <div
                className={cn(
                  classes.placeHolder,
                  'swiper-lazy-preloader',
                  'swiper-lazy-preloader-white'
                )}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div>
          <img className={classes.image} src={images[0]} alt="listing" />
        </div>
      )}
    </>
  )
}

export default memo(ListingCardMediaSlider)
