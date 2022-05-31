import { memo, useRef } from 'react'

import { makeStyles, Popper } from '@material-ui/core'
import cn from 'classnames'

import { noop } from '@app/utils/helpers'
import {
  getListingFormattedPrice,
  getStatusColorClass
} from '@app/utils/listing'

import { MINIMAL_MARKER_ZOOM_LEVEL } from '../../constants'
import useUiListingsContext from '../../context/useUiListingsContext'
import MarkerPopup from '../MarkerPopup'

const useStyles = makeStyles(
  theme => ({
    bubble: {
      position: 'relative',
      transform: 'translate(-26px, -25px)', // Marker Anchor
      height: 20,
      minWidth: 45,
      cursor: 'pointer',
      borderRadius: 3,
      overflow: 'visible',
      textAlign: 'center',
      fontFamily: `${theme.typography.h6.fontFamily}, Roboto, Arial, sans-serif`,
      fontSize: 12,
      fontWeight: theme.typography.h6.fontWeight,
      color: '#fff',
      boxShadow: '0px 10px 18px -6px rgba(0,0,0,0.42)',
      transition: 'transform .1s, padding .1s',
      padding: '2px 4px',
      zIndex: 1,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '87%',
        left: '50%',
        height: 7,
        width: 12,
        // transform: 'translate(-50%, 0)',
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
      },
      '&.clicked': {
        zIndex: 5
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
      zIndex: 1,
      '&.hover, &.clicked': {
        backgroundColor: `${theme.palette.grey[800]} !important`,
        height: 15,
        width: 15,
        transform: 'translate(-8px, -8px)', // Marker Anchor
        zIndex: 3
      },
      '&.clicked': {
        zIndex: 5
      }
    },
    popover: {
      zIndex: theme.zIndex.modal - 2
    }
  }),
  { name: 'Maker' }
)

interface Props {
  lat?: number
  lng?: number
  hover?: boolean
  clicked?: boolean
  id: UUID
  price: number
  squareMeters: number
  status: IListingStatus
  address: ICompactAddress
  bathroomCount: Nullable<number>
  bedroomCount: Nullable<number>
  coverImageUrl: string
  propertyType: string
  mlsSource?: string
  zoom?: number
  onClick?: (id: UUID) => void
}

const Marker = ({
  lat,
  lng,
  id,
  status,
  price,
  address,
  squareMeters,
  bathroomCount,
  bedroomCount,
  coverImageUrl,
  propertyType,
  mlsSource,
  onClick = noop,
  zoom = MINIMAL_MARKER_ZOOM_LEVEL
}: Props) => {
  const classes = useStyles()
  const markerRef = useRef<Nullable<HTMLDivElement>>(null)
  const [uiState] = useUiListingsContext()

  const hover = uiState.hover === id
  const clicked = uiState.click === id

  if (!lat || !lng) {
    return null
  }

  const formattedPrice = getListingFormattedPrice(price, true)
  const statusColor = getStatusColorClass(status)

  const isShowBubble = zoom >= MINIMAL_MARKER_ZOOM_LEVEL
  const isShowPopper = (hover && isShowBubble) || clicked

  // We render markers differently based on the current zoom level...
  return (
    <>
      <div
        ref={markerRef}
        aria-describedby={id}
        className={cn({
          [classes.bubble]: isShowBubble,
          [classes.dot]: !isShowBubble,
          hover,
          clicked
        })}
        style={{ backgroundColor: statusColor }}
      >
        {isShowBubble && formattedPrice}
      </div>
      {isShowPopper && (
        <Popper
          id={id}
          open
          anchorEl={markerRef.current}
          className={classes.popover}
        >
          <MarkerPopup
            onClick={() => onClick(id)}
            status={status}
            price={price}
            address={address}
            squareMeters={squareMeters}
            bathroomCount={bathroomCount}
            bedroomCount={bedroomCount}
            coverImageUrl={coverImageUrl}
            propertyType={propertyType}
            mlsSource={mlsSource}
          />
        </Popper>
      )}
    </>
  )
}

export default memo(Marker)
