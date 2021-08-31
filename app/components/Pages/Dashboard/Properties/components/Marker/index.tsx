import { makeStyles } from '@material-ui/core'
import cn from 'classnames'
import { useSelector } from 'react-redux'

import { selectUserUnsafe } from '@app/selectors/user'
import { getListingFormatedPrice, getStatusColorClass } from 'utils/listing'

import { MINIMAL_MARKER_ZOOM_LEVEL } from '../../mapOptions'
import MarkerPopup from '../MarkerPopup'

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
      '&.hover, &.clicked': {
        height: 25,
        width: 55,
        backgroundColor: `${theme.palette.grey[800]} !important`,
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
      '&.hover, &.clicked': {
        backgroundColor: `${theme.palette.grey[800]} !important`,
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
  hover?: boolean
  clicked?: boolean
  listing: ICompactListing
  zoom?: number
}

const Marker = ({
  lat,
  lng,
  listing,
  hover,
  clicked,
  zoom = MINIMAL_MARKER_ZOOM_LEVEL
}: Props) => {
  const classes = useStyles()
  const user = useSelector(selectUserUnsafe)

  if (!lat || !lng) {
    return null
  }

  const formatedPrice = getListingFormatedPrice(listing, user, true)
  const statusColor = getStatusColorClass(listing.status)

  // We render markers differently based on the current zoom level...
  return (
    <>
      {zoom >= MINIMAL_MARKER_ZOOM_LEVEL && (
        <div
          className={cn(classes.bubble, {
            hover,
            clicked
          })}
          style={{ backgroundColor: statusColor }}
        >
          {`${formatedPrice}`}
          {(hover || clicked) && <MarkerPopup listing={listing} />}
        </div>
      )}
      {zoom < MINIMAL_MARKER_ZOOM_LEVEL && (
        <div
          className={cn(classes.dot, {
            hover,
            clicked
          })}
          style={{ backgroundColor: statusColor }}
        >
          {(hover || clicked) && <MarkerPopup listing={listing} />}
        </div>
      )}
    </>
  )
}

export default Marker
