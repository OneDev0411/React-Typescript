import { useState, useRef, useCallback, useEffect } from 'react'

import { useTheme } from '@material-ui/core'
import GoogleMap, { ChangeEventValue } from 'google-map-react'

import { ListingDetailsModal } from 'components/ListingDetailsModal'

import Marker from '../../../components/Marker'
import { bootstrapURLKeys } from '../../../constants/constants'
import {
  pointsFromPolygon,
  createMapOptions,
  createMapPolygonOptions
} from '../../../helpers/map-helpers'
import {
  changeListingHoverState,
  changeListingClickedState,
  setMapBounds
} from '../../context/actions'
import useListingsContext from '../../hooks/useListingsContext'

interface Props {
  isWidget: boolean
  drawingMode?: boolean
  drawingModeCallBack: (points: ICoord[]) => void
  onChange: (center: ICoord, zoom: number, bounds?: IBounds) => void
}

interface ListingModalState {
  id: UUID
  isOpen: boolean
}

export const Map = ({
  isWidget,
  drawingMode = true,
  drawingModeCallBack,
  onChange
}: Props) => {
  const [state, dispatch] = useListingsContext()
  const mapIsLoaded = useRef<boolean>(false)
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
  const oldRrawingRef = useRef<any>()

  const closeListingModal = () => {
    if (!isWidget) {
      window.history.pushState({}, '', '/dashboard/properties')
    }

    setListingModalState({ id: '', isOpen: false })
  }

  const openListingModal = (id: UUID) => {
    if (!isWidget) {
      window.history.pushState({}, '', `/dashboard/properties/${id}`)
    }

    setListingModalState({ id, isOpen: true })
  }

  const changeHoverState = (id: UUID, hover: boolean) => {
    dispatch(changeListingHoverState(hover ? id : null))
  }

  const toggleClickedState = (key: UUID) => {
    const resultElement = document.getElementById(key)

    if (resultElement) {
      // Smooth scrolling doesn't work on Chrome for some reason
      resultElement.scrollIntoView({ behavior: 'smooth' })
    }

    dispatch(changeListingClickedState(key))
  }

  const onMapClick = () => dispatch(changeListingClickedState(null))

  const handleChange = ({ center, zoom, bounds }: ChangeEventValue) => {
    dispatch(setMapBounds(center, zoom, bounds))
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

    // add old drawing if it exist before map is loaded
    if (state.search.drawing.length) {
      oldRrawingRef.current = new google.maps.Polygon({
        ...mapPolygonOptions,
        paths: state.search.drawing
      })
      oldRrawingRef.current.setMap(mapRef.current)
    }

    // This is for internal uses of this component since some methods can only
    // execute when map is loaded
    mapIsLoaded.current = true
  }

  // TODO: implement freehand drawing:
  // https://stackoverflow.com/questions/22758950
  const activateDrawingMode = useCallback(callback => {
    drawingManagerRef.current.setMap(mapRef.current)
    drawingManagerRef.current.setDrawingMode(
      mapsRef.current.drawing.OverlayType.POLYGON
    )

    mapsRef.current.event.addListener(
      drawingManagerRef.current,
      'polygoncomplete',
      drawing => {
        // User changed his mind and cancelled drawing
        drawingRef.current = drawing

        if (!drawingMode) {
          return
        }

        if (typeof callback === 'function') {
          const drawingPoints = pointsFromPolygon(drawing)

          callback(drawingPoints)
        }
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deactivateDrawingMode = () => {
    if (drawingManagerRef.current) {
      // https://developers.google.com/maps/documentation/javascript/reference/drawing
      drawingManagerRef.current.setDrawingMode(null)
      drawingRef?.current?.setMap(null)
    }
  }

  useEffect(() => {
    if (mapIsLoaded.current && !drawingMode) {
      deactivateDrawingMode()
    }

    if (mapIsLoaded.current && drawingMode) {
      activateDrawingMode(drawingModeCallBack)
    }
  }, [drawingMode, drawingModeCallBack, activateDrawingMode])

  useEffect(() => {
    if (state.search.drawing.length === 0) {
      // Google API for removing already exisiting drawing
      drawingRef?.current?.setMap(null)

      // Remove old drawing if it exists
      oldRrawingRef?.current?.setMap(null)
    }
  }, [state.search])

  return (
    <>
      <GoogleMap
        center={state.map.center}
        zoom={state.map.zoom}
        bootstrapURLKeys={bootstrapURLKeys}
        // we show/hide map controls based on drawing/normal mode
        options={maps => createMapOptions(maps, drawingMode)}
        onChildMouseEnter={(id: UUID) => {
          changeHoverState(id, true)
        }}
        onChildMouseLeave={(id: UUID) => {
          changeHoverState(id, false)
        }}
        onChildClick={toggleClickedState}
        onClick={onMapClick}
        onChange={handleChange}
        onGoogleApiLoaded={onLoad}
        yesIWantToUseGoogleMapApiInternals
        style={{ height: '100%', width: '100%' }}
      >
        {!drawingMode &&
          state.result.listings.map(listing => (
            <Marker
              hover={state.listingStates.hover === listing.id}
              clicked={state.listingStates.click === listing.id}
              onClick={() => {
                openListingModal(listing.id)
              }}
              key={listing.id}
              lat={listing.location?.latitude}
              lng={listing.location?.longitude}
              listing={listing}
              zoom={state.map.zoom}
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
