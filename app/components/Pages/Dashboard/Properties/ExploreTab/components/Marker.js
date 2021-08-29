import { makeStyles } from '@material-ui/core'
import cn from 'classnames'
import numeral from 'numeral'

import MarkerPopup from './MarkerPopup'

const useStyles = makeStyles(
  () => ({
    bubble: {
      position: 'relative',
      transform: 'translate(-26px, -25px)', // Marker Anchor
      height: 20,
      width: 50,
      background: '#00B286',
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
        backgroundColor: '#0F3057',
        transform: 'translate(-28px, -28px)', // Marker Anchor
        padding: 3,
        zIndex: 3
      }
    },
    dot: {
      height: 10,
      width: 10,
      transform: 'translate(-5px, -5px)', // Marker Anchor
      backgroundColor: '#00B286',
      border: '1px solid #fff',
      borderRadius: '50%',
      display: 'inline-block',
      boxShadow: '0px 10px 18px -6px rgba(0,0,0,0.42)',
      cursor: 'pointer',
      '&.hover, &.selected': {
        backgroundColor: '#0F3057',
        height: 15,
        width: 15,
        transform: 'translate(-8px, -8px)', // Marker Anchor
        zIndex: 2
      }
    }
  }),
  { name: 'Maker' }
)

const Marker = ({ lat, lng, listing, zoom }) => {
  const classes = useStyles()

  if (!lat || !lng) {
    return null
  }

  const price_small = numeral(listing.price).format('0.[00]a')

  // We render markers differently based on the current zoom level...
  return (
    <>
      {zoom >= 8 && (
        <div
          data-lat={lat}
          data-lng={lng}
          className={cn(classes.bubble, {
            hover: listing.hover,
            selected: listing.clicked
          })}
        >
          {`${price_small}`}
          {(listing.hover || listing.clicked) && (
            <MarkerPopup listing={listing} />
          )}
        </div>
      )}
      {zoom < 8 && (
        <div
          data-lat={lat}
          data-lng={lng}
          className={cn(classes.dot, {
            hover: listing.hover,
            selected: listing.clicked
          })}
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
