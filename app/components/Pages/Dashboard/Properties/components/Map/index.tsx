import { useState, useRef, useCallback, useEffect } from 'react'

import { useTheme } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import MyLocationIcon from '@material-ui/icons/MyLocation'
import GoogleMap, { ChangeEventValue } from 'google-map-react'

import { noop } from '@app/utils/helpers'
import { ListingDetailsModal } from 'components/ListingDetailsModal'

import { bootstrapURLKeys } from '../../constants'
import {
  pointsFromPolygon,
  createMapOptions,
  createMapPolygonOptions
} from '../../helpers/map-helpers'
import { IMapPosition } from '../../types'
import { DrawingModeBar } from '../DrawingModeBar'
import { GoogleMapsButton } from '../GoogleMapsButton'
import { MapToggler } from '../MapToggler'
import Marker from '../Marker'

interface Props {
  isWidget: boolean
  mapIsShown?: boolean
  mapPosition: IMapPosition
  listings: ICompactListing[]
  hoverListing: Nullable<UUID>
  clickedListing: Nullable<UUID>
  hasDrawingMode?: boolean
  drawing?: ICoord[]
  onDrawingComplete?: (points: ICoord[]) => void
  onRemoveDrawing?: () => void
  onChange: (center: ICoord, zoom: number, bounds?: IBounds) => void
  onChangeHoverState?: (id: UUID, hover: boolean) => void
  onOpenListingModal?: (id: UUID) => void
  onCloseListingModal?: () => void
  onMapClick?: () => void
  onClickToggleMap?: () => void
  onMarkerClick?: (key: UUID) => void
  onClickLocate: () => void
}

interface ListingModalState {
  id: UUID
  isOpen: boolean
}

export const Map = ({
  mapIsShown = true,
  isWidget,
  mapPosition,
  listings,
  hoverListing,
  clickedListing,
  hasDrawingMode = false,
  drawing = [],
  onRemoveDrawing = noop,
  onDrawingComplete,
  onChange,
  onOpenListingModal = noop,
  onCloseListingModal = noop,
  onChangeHoverState = noop,
  onMarkerClick = noop,
  onMapClick = noop,
  onClickToggleMap = noop,
  onClickLocate
}: Props) => {
  const mapIsLoaded = useRef<boolean>(false)
  const [drawingMode, setDrawingMode] = useState(false)
  const [listingModalState, setListingModalState] = useState<ListingModalState>(
    { id: '', isOpen: false }
  )
  const theme = useTheme()
  const mapPolygonOptions = createMapPolygonOptions(theme)
  // setting up refs
  // There is no way to get apropiate types for these
  const mapRef = useRef<any>()
  const mapsRef = useRef<any>()
  const drawingManagerRef = useRef<any>()
  const drawingRef = useRef<any>()

  const closeListingModal = () => {
    setListingModalState({ id: '', isOpen: false })
    onCloseListingModal()
  }

  const openListingModal = (id: UUID) => {
    setListingModalState({ id, isOpen: true })
    onOpenListingModal(id)
  }

  const handleChange = ({ center, zoom, bounds }: ChangeEventValue) => {
    onChange(center, zoom, bounds)
  }

  // map: The map object on the page
  // maps: eq. google.maps
  // There is no way to get apropiate types for these
  const onLoad = ({ map, maps }: { map: any; maps: any }) => {
    mapRef.current = map
    mapsRef.current = maps

    drawingManagerRef.current = new mapsRef.current.drawing.DrawingManager({
      drawingControl: false,
      drawingMode: mapsRef.current.drawing.OverlayType.POLYGON,
      polygonOptions: mapPolygonOptions
    })

    // This is for internal uses of this component since some methods can only
    // execute when map is loaded
    mapIsLoaded.current = true
  }

  // TODO: implement freehand drawing:
  // https://stackoverflow.com/questions/22758950
  const activateDrawingMode = useCallback(
    callback => {
      drawingManagerRef.current.setMap(mapRef.current)
      drawingManagerRef.current.setDrawingMode(
        mapsRef.current.drawing.OverlayType.POLYGON
      )

      mapsRef.current.event.addListener(
        drawingManagerRef.current,
        'polygoncomplete',
        drawing => {
          drawingRef.current = drawing

          if (typeof callback === 'function') {
            const drawingPoints = pointsFromPolygon(drawing)

            callback(drawingPoints)
            setDrawingMode(false)
            drawingManagerRef?.current?.setDrawingMode(null)
          }
        }
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleRemoveDrawing = () => {
    onRemoveDrawing()
    drawingRef?.current?.setMap(null)
  }

  const cancelDrawingMode = () => {
    setDrawingMode(false)

    drawingManagerRef?.current?.setMap(null)
    drawingRef?.current?.setMap(null)
  }

  useEffect(() => {
    if (mapIsLoaded.current && drawingMode) {
      activateDrawingMode(onDrawingComplete)
    }
  }, [drawingMode, onDrawingComplete, activateDrawingMode])

  return (
    <>
      {!drawingMode && (
        <>
          <GoogleMapsButton
            tooltip="Hide map"
            top={9}
            left={10}
            onClick={onClickToggleMap}
          >
            <MapToggler checked={mapIsShown} />
          </GoogleMapsButton>
          <GoogleMapsButton
            size="small"
            bottom={90}
            left={10}
            iconButton
            tooltip="Get your exact location on the map"
            startIcon={<MyLocationIcon />}
            onClick={() => onClickLocate()}
          />
        </>
      )}
      {hasDrawingMode && (
        <>
          {drawingMode && <DrawingModeBar onCancel={cancelDrawingMode} />}
          {!drawingMode && drawing.length === 0 && (
            <GoogleMapsButton
              top={9}
              right={10}
              startIcon={<EditIcon />}
              tooltip="Define an area for searching"
              onClick={() => setDrawingMode(true)}
            >
              Draw Area
            </GoogleMapsButton>
          )}
          {!drawingMode && drawing.length > 0 && (
            <GoogleMapsButton
              top={9}
              right={10}
              startIcon={<EditIcon />}
              onClick={handleRemoveDrawing}
              active
            >
              Remove Drawing
            </GoogleMapsButton>
          )}
        </>
      )}
      <GoogleMap
        center={mapPosition.center}
        zoom={mapPosition.zoom}
        bootstrapURLKeys={bootstrapURLKeys}
        // we show/hide map controls based on drawing/normal mode
        options={maps => createMapOptions(maps, drawingMode)}
        onChildMouseEnter={(id: UUID) => {
          onChangeHoverState(id, true)
        }}
        onChildMouseLeave={(id: UUID) => {
          onChangeHoverState(id, false)
        }}
        onChildClick={onMarkerClick}
        onClick={onMapClick}
        onChange={handleChange}
        onGoogleApiLoaded={onLoad}
        yesIWantToUseGoogleMapApiInternals
        style={{ height: '100%', width: '100%' }}
      >
        {!drawingMode &&
          mapIsShown &&
          listings.map(listing => (
            <Marker
              hover={hoverListing === listing.id}
              clicked={clickedListing === listing.id}
              onClick={openListingModal}
              key={listing.id}
              lat={listing.location?.latitude}
              lng={listing.location?.longitude}
              id={listing.id}
              status={listing.status}
              price={listing.price}
              closePrice={listing.close_price}
              address={listing.address}
              squareMeters={listing.compact_property.square_meters}
              bathroomCount={listing.compact_property.bathroom_count}
              bedroomCount={listing.compact_property.bedroom_count}
              coverImageUrl={listing.cover_image_url}
              zoom={mapPosition.zoom}
            />
          ))}
      </GoogleMap>
      <ListingDetailsModal
        isOpen={listingModalState.isOpen}
        isWidget={isWidget}
        listingId={listingModalState.id}
        closeHandler={closeListingModal}
      />
    </>
  )
}
