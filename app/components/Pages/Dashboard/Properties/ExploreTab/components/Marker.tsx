import { makeStyles } from '@material-ui/core'
import cn from 'classnames'
import numeral from 'numeral'

import listing_util from 'utils/listing'

import { MINIMAL_MARKER_ZOOM_LEVEL } from '../../mapOptions'

import MarkerPopup from './MarkerPopup'

const useStyles = makeStyles(
  theme => ({
    bubble: {
      position: 'relative',
      transform: 'translate(-26px, -25px)', // Marker Anchor
      height: 20,
      width: 50,
      cursor: 'pointer',
      borderRadius: 3,
      overflow: 'visible',
      textAlign: 'center',
      fontFamily: 'Lato',
      fontSize: 13,
      fontWeight: 'bold',
      color: '#fff',
      boxShadow: '0px 10px 18px -6px rgba(0,0,0,0.42)',
      transition: 'width .1s, height .1s, transform .1s, padding .1s',
      padding: 2,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '100%',
        left: '45%',
        height: 5,
        width: 8,
        background: 'inherit',
        clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
      },
      '&.hover, &.selected': {
        height: 25,
        width: 55,
        backgroundColor: theme.palette.grey[800],
        transform: 'translate(-28px, -28px)', // Marker Anchor
        padding: 3,
        zIndex: 3
      }
    },
    dot: {
      height: 10,
      width: 10,
      transform: 'translate(-5px, -5px)', // Marker Anchor
      border: '1px solid #fff',
      borderRadius: '50%',
      display: 'inline-block',
      boxShadow: '0px 10px 18px -6px rgba(0,0,0,0.42)',
      cursor: 'pointer',
      '&.hover, &.selected': {
        backgroundColor: theme.palette.grey[800],
        height: 15,
        width: 15,
        transform: 'translate(-8px, -8px)', // Marker Anchor
        zIndex: 2
      }
    }
  }),
  { name: 'Maker' }
)

interface Props {
  lat?: number
  lng?: number
  listing: ICompactListingWithUIState
  zoom?: number
}

const Marker = ({
  lat,
  lng,
  listing,
  zoom = MINIMAL_MARKER_ZOOM_LEVEL
}: Props) => {
  const classes = useStyles()

  if (!lat || !lng) {
    return null
  }

  const price_small: string = numeral(listing.price).format('0.[00]a')

  const status_color = listing_util.getStatusColorClass(listing.status)

  // We render markers differently based on the current zoom level...
  return (
    <>
      {zoom >= MINIMAL_MARKER_ZOOM_LEVEL && (
        <div
          className={cn(classes.bubble, {
            hover: listing.hover,
            selected: listing.clicked
          })}
          style={{ backgroundColor: status_color }}
        >
          {`${price_small}`}
          {(listing.hover || listing.clicked) && (
            <MarkerPopup listing={listing} />
          )}
        </div>
      )}
      {zoom < MINIMAL_MARKER_ZOOM_LEVEL && (
        <div
          className={cn(classes.dot, {
            hover: listing.hover,
            selected: listing.clicked
          })}
          style={{ backgroundColor: status_color }}
        >
          {(listing.hover || listing.clicked) && (
            <MarkerPopup listing={listing} />
          )}
        </div>
      )}
    </>
  )
}

export default Marker
