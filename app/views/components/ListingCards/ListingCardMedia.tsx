import React, { CSSProperties, ReactNode } from 'react'
import { fade, makeStyles, Theme } from '@material-ui/core'
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'

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
      backgroundColor: theme.palette.grey[100],

      // Arrow keys style overrides
      '& button.default-nav': {
        zIndex: 3,
        backgroundColor: 'transparent !important',

        '&:first-of-type': {
          transform: 'translateX(8px)'
        },

        '&:last-of-type': {
          transform: 'translateX(-8px)'
        },

        '& svg': {
          filter: `drop-shadow(0px 1px 4px ${fade(
            theme.palette.text.primary,
            0.8
          )})`
        },

        '& path': {
          fill: theme.palette.common.white
        }
      }
    },
    childrenContainer: {
      position: 'absolute',
      zIndex: 1,
      width: '100%',
      height: '100%'
    },
    image: ({ listing }: Pick<Props, 'listing'>) => ({
      height: 200,
      width: '100%',
      objectFit: getListingImageObjectFit(listing),
      backgroundColor: theme.palette.grey[100]
    })
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
          targetElement.classList.contains('default-nav') ||
          targetElement.tagName.toLowerCase() === 'path' ||
          targetElement.tagName.toLowerCase() === 'svg'
        ) {
          e.stopPropagation()
        }
      }}
    >
      <div className={classes.childrenContainer}>{children}</div>
      {images.length > 1 ? (
        <Slide canSwipe={false} transitionDuration={200} autoplay={false}>
          {images.map(image => (
            <div key={image}>
              <img className={classes.image} src={image} alt="listing" />
            </div>
          ))}
        </Slide>
      ) : (
        <div>
          <img className={classes.image} src={images[0]} alt="listing" />
        </div>
      )}
    </div>
  )
}
