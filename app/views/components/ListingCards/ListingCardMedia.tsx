import React, { CSSProperties, ReactNode } from 'react'
import cn from 'classnames'
import { makeStyles, Theme } from '@material-ui/core'

import { Swiper, SwiperSlide } from 'swiper/react'

import SwiperCore, { Lazy, Navigation } from 'swiper/core'

SwiperCore.use([Lazy, Navigation])

const PLACEHOLDER_IMAGE = '/static/images/logo--gray.svg'

function getListingImages(listing: IListing | ICompactListing): string[] {
  return listing.gallery_image_urls && listing.gallery_image_urls.length
    ? listing.gallery_image_urls
    : [PLACEHOLDER_IMAGE]
}

function getListingImageObjectFit(
  listing: IListing | ICompactListing
): CSSProperties['objectFit'] {
  return listing.gallery_image_urls && listing.gallery_image_urls.length > 0
    ? 'cover'
    : 'none'
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      backgroundColor: theme.palette.grey[100]
    },
    childrenContainer: {
      position: 'absolute',
      zIndex: 2,
      width: '100%',
      top: 0,
      left: 0
    },
    image: ({ listing }: Pick<Props, 'listing'>) => ({
      height: 200,
      width: '100%',
      objectFit: getListingImageObjectFit(listing),
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
      '--swiper-navigation-color': '#fff'
    }
  }),
  {
    name: 'ListingCardMedia'
  }
)

interface Props {
  listing: IListing | ICompactListing
  children: ReactNode
}

export default function ListingCardMedia({ children, listing }: Props) {
  const images = getListingImages(listing)

  const classes = useStyles({ listing })

  return (
    <div
      className={classes.container}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.persist()

        const targetElement = e.target as HTMLElement

        if (
          targetElement.classList.contains('swiper-button-next') ||
          targetElement.tagName.toLowerCase() === 'path' ||
          targetElement.tagName.toLowerCase() === 'svg'
        ) {
          e.stopPropagation()
        }
      }}
    >
      <div className={classes.childrenContainer}>{children}</div>
      {images.length > 1 ? (
        <Swiper lazy navigation className={classes.swiper}>
          {images.map(image => (
            <SwiperSlide key={image}>
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
    </div>
  )
}
