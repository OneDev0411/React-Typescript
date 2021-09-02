import { useState, useRef, useCallback, useEffect } from 'react'

import { useTheme } from '@material-ui/core'
import GoogleMap, { ChangeEventValue } from 'google-map-react'

import Marker from '../../components/Marker'
import { bootstrapURLKeys } from '../../helpers/constants'
import { pointsFromPolygon, createMapOptions } from '../../helpers/map-helpers'
import {
  changeListingHoverState,
  changeListingClickedState,
  setMapBounds
} from '../context/actions'
import useListingsContext from '../hooks/useListingsContext'

interface Props {
  drawingMode?: boolean
  drawingModeCallBack: (points: ICoord[]) => void
  onChange: (center: ICoord, zoom: number, bounds?: IBounds) => void
}

export const Map = ({
  drawingMode = true,
  drawingModeCallBack,
  onChange
}: Props) => {
  const [state, dispatch] = useListingsContext()
  const [mapIsLoaded, setMapIsLoaded] = useState(false)
  const theme = useTheme()
  // setting up refs
  // There is no way to get apropiate types for these
  const mapRef = useRef<any>()
  const mapsRef = useRef<any>()
  const drawingManagerRef = useRef<any>()
  const drawingRef = useRef<any>()

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
      polygonOptions: {
        zIndex: 1,
        strokeWeight: 3,
        fillOpacity: 0.3,
        fillColor: theme.palette.primary.main,
        strokeColor: theme.palette.primary.main
      }
    })

    // This is for internal uses of this component since some methods can only
    // execute when map is loaded
    setMapIsLoaded(true)
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
        drawingRef.current = drawing

        const drawingPoints = pointsFromPolygon(drawing)

        if (typeof callback === 'function') {
          callback(drawingPoints)
        }
      }
    )
  }, [])

  const deactivateDrawingMode = () => {
    if (drawingManagerRef.current) {
      // https://developers.google.com/maps/documentation/javascript/reference/drawing
      drawingManagerRef.current.setDrawingMode(null)
    }
  }

  useEffect(() => {
    if (mapIsLoaded && !drawingMode) {
      deactivateDrawingMode()
    }

    if (mapIsLoaded && drawingMode) {
      activateDrawingMode(drawingModeCallBack)
    }
  }, [mapIsLoaded, drawingMode, drawingModeCallBack, activateDrawingMode])

  useEffect(() => {
    if (state.search.drawing.length === 0) {
      // Google API for removing already exisiting drawing
      drawingRef?.current?.setMap(null)
    }
  }, [state.search])

  return (
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
            key={listing.id}
            lat={listing.location?.latitude}
            lng={listing.location?.longitude}
            listing={listing}
            zoom={state.map.zoom}
          />
        ))}
    </GoogleMap>
  )
}
