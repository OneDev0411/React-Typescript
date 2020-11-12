import React, { ReactNode } from 'react'
import { makeStyles, Theme } from '@material-ui/core'
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'

const PLACEHOLDER_IMAGE = '/static/images/logo--gray.svg'

function getListingImages(listing: IListing | ICompactListing): string[] {
  if (listing.type === 'compact_listing') {
    return listing.cover_image_url
      ? [listing.cover_image_url]
      : [PLACEHOLDER_IMAGE]
  }

  return listing.gallery_image_urls && listing.gallery_image_urls.length
    ? listing.gallery_image_urls
    : [PLACEHOLDER_IMAGE]
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      height: 200,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[100],

      // Arrow keys style overrides
      '& button.default-nav': {
        zIndex: theme.zIndex.sideNavDrawer + 1,
        backgroundColor: 'transparent !important',

        '&:first-of-type': {
          transform: 'translateX(8px)'
        },

        '&:last-of-type': {
          transform: 'translateX(-8px)'
        },

        '& path': {
          fill: theme.palette.common.white
        }
      }
    },
    childrenContainer: {
      position: 'absolute',
      zIndex: theme.zIndex.sideNavDrawer,
      width: '100%',
      height: '100%'
    },
    image: ({ listing }: Props) => ({
      height: 200,
      width: '100%',
      objectFit: 'cover',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[100],
      backgroundSize: listing.cover_image_url ? 'cover' : 'contain'
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
  const classes = useStyles({ listing })

  const images = getListingImages(listing)

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
        <Slide transitionDuration={200} autoplay={false}>
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
