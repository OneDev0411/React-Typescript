import { useState, useCallback } from 'react'

import { Box, Button, makeStyles } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { setUserSetting } from '@app/store_actions/user/set-setting'
import {
  GoogleMapLibrary,
  isMapLibrariesLoaded,
  loadMapLibraries
} from '@app/utils/google-map-api'
import { confirmation } from 'actions/confirmation'

import CreateAlertModal from '../../../components/modals/CreateAlertModal'
import { Header } from '../../../components/PageHeader'
import { ShareListings } from '../../../components/ShareListings'
import Tabs from '../../../components/Tabs'
import { QUERY_LIMIT, bootstrapURLKeys } from '../../../helpers/constants'
import { coordToPoint, pointFromBounds } from '../../../helpers/map-helpers'
import {
  getDefaultSort,
  LAST_BROWSING_LOCATION,
  parseSortIndex,
  SortString
} from '../../../helpers/sort-utils'
import {
  setMapDrawing,
  removeMapDrawing,
  setMapBounds,
  setMapLocation
} from '../../context/actions'
import useListingsContext from '../../hooks/useListingsContext'
import Autocomplete from '../Autocomplete'
import { DrawingModeBar } from '../DrawingModeBar'
import { Filters } from '../Filters'
import { GoogleMapsButton } from '../GoogleMapsButton'
import { Map } from '../Map'
import { MapToggler } from '../MapToggler'
import { Results } from '../Results'

const useStyles = makeStyles(
  () => ({
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    searchBar: {
      paddingTop: '10px',
      paddingBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    main: {
      flexGrow: 1,
      display: 'flex',
      overflow: 'hidden'
    },
    map: {
      flexBasis: '50%',
      minHeight: '100%',
      position: 'relative'
    },
    mapCanvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%'
    },
    mapToggler: {
      position: 'absolute',
      top: 5,
      left: 5,
      backgroundColor: 'white',
      padding: '3px 10px',
      borderRadius: 3,
      zIndex: 3
    },
    results: {
      flexBasis: '50%',
      minHeight: '100%',
      padding: '0 10px',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    },
    selectionActionBar: {
      position: 'absolute',
      bottom: 20,
      right: 0,
      width: 'calc(100% - 192px)'
    }
  }),
  { name: 'PropertiesMainLayout' }
)

declare const window: Window &
  typeof globalThis & {
    initialize: () => void
  }

interface Props {
  user: IUser
  isWidget: boolean
}

export type ViewType = 'cards' | 'table'

export function ExplorePage({ user, isWidget }: Props) {
  const [state, dispatch] = useListingsContext()
  const classes = useStyles()

  const reduxDispatch = useDispatch()
  const [mapIsShown, setMapIsShown] = useState(true)
  const [mapIsInitialized, setMapIsInitialized] = useState(false)
  const [drawingMode, setDrawingMode] = useState(false)
  const [isShowAlertModal, setIsShowAlertModal] = useState(false)
  const [viewType, setViewType] = useState<ViewType>('cards')
  const [activeSort, setActiveSort] = useState(
    parseSortIndex(getDefaultSort(user))
  )

  const onChangeSort = (sort: SortString) => {
    setActiveSort(parseSortIndex(sort))
  }

  const onToggleView = (to: ViewType) => {
    setViewType(to)
  }
  const activateDrawingMode = () => {
    setDrawingMode(true)
  }

  const deactivateDrawingMode = () => {
    setDrawingMode(false)
  }

  const removeDrawing = () => {
    dispatch(removeMapDrawing())
  }

  const searchArea = useCallback((points: ICoord[]) => {
    console.log(points)
    setDrawingMode(false)
    dispatch(setMapDrawing(points))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMap = () => setMapIsShown(mapIsShown => !mapIsShown)

  const onSelectPlace = (center: ICoord, zoom: number, bounds: IBounds) => {
    if (viewType === 'cards') {
      dispatch(setMapLocation(center, zoom))
    } else {
      dispatch(setMapBounds(center, zoom, bounds))
    }
  }

  useEffectOnce(() => {
    window.initialize = initialize

    const googleMapAPIParams = {
      key: bootstrapURLKeys.key,
      libraries: bootstrapURLKeys.libraries.split(',') as GoogleMapLibrary[],
      callback: 'initialize'
    }

    if (isMapLibrariesLoaded(googleMapAPIParams.libraries)) {
      console.log('already loaded')
      initialize()
    } else {
      loadMapLibraries(googleMapAPIParams)
    }
  })

  const initialize = () => {
    setMapIsInitialized(true)
  }

  const updateUserLocation = useCallback(
    (center: ICoord, zoom: number) => {
      // Anonymous user's can also see /mls and explore the map
      // So updatingLastBrowsing location should not be run for them
      if (user) {
        reduxDispatch(setUserSetting(LAST_BROWSING_LOCATION, { center, zoom }))
      }
    },
    [user, reduxDispatch]
  )

  const handleSaveSearch = () => {
    if (state.result.info && state.result.info.total < 400) {
      setIsShowAlertModal(true)
    } else {
      reduxDispatch(
        confirmation({
          confirmLabel: 'Ok',
          description:
            'Please zoom in or set more filters. You can save max 400 listings.',
          hideCancelButton: true,
          message: 'Too many matches!'
        })
      )
    }
  }

  const onCloseAlertModal = () => {
    setIsShowAlertModal(false)
  }

  return (
    <>
      <Box className={classes.container}>
        <Header title="Properties" />
        <Tabs user={user} isWidget={isWidget} />
        <Box className={classes.searchBar}>
          <Autocomplete isMapView={mapIsShown} onSelectPlace={onSelectPlace} />
          <Box>
            <Filters />
            <Button
              size="small"
              variant="contained"
              color="primary"
              disabled={state.isLoading}
              onClick={handleSaveSearch}
            >
              Save Search
            </Button>
          </Box>
        </Box>

        <Box className={classes.main}>
          {mapIsShown && mapIsInitialized && (
            <Box className={classes.map}>
              <Box className={classes.mapCanvas}>
                {!drawingMode && (
                  <>
                    <GoogleMapsButton top={9} left={5}>
                      <MapToggler checked={mapIsShown} onChange={toggleMap} />
                    </GoogleMapsButton>
                    <GoogleMapsButton
                      top={9}
                      right={9}
                      startIcon={<EditIcon />}
                      onClick={() => activateDrawingMode()}
                    >
                      Draw Area
                    </GoogleMapsButton>
                  </>
                )}
                {state.search.drawing.length > 0 && (
                  <GoogleMapsButton
                    top={9}
                    right={9}
                    startIcon={<EditIcon />}
                    onClick={removeDrawing}
                    active
                  >
                    Remove Drawing
                  </GoogleMapsButton>
                )}
                {drawingMode && (
                  <DrawingModeBar onCancel={deactivateDrawingMode} />
                )}
                <Map
                  drawingMode={drawingMode}
                  drawingModeCallBack={searchArea}
                  onChange={updateUserLocation}
                />
              </Box>
            </Box>
          )}
          <Box className={classes.results}>
            <Results
              mapIsShown={mapIsShown}
              onMapToggle={toggleMap}
              viewType={viewType}
              onChangeSort={onChangeSort}
              activeSort={activeSort}
              onToggleView={onToggleView}
              isWidget={isWidget}
            />
          </Box>
        </Box>
      </Box>
      <Box className={classes.selectionActionBar}>
        <ShareListings />
      </Box>
      <CreateAlertModal
        user={user}
        onHide={onCloseAlertModal}
        isActive={isShowAlertModal}
        alertProposedTitle={state.result.info?.proposed_title}
        searchOptions={{
          ...state.search.filters,
          points:
            state.search.drawing.length > 0
              ? state.search.drawing.map(coordToPoint)
              : pointFromBounds(state.search.bounds),
          ...(state.search.office ? { offices: [state.search.office] } : {}),
          postal_codes: null,
          limit: QUERY_LIMIT
        }}
        drawingPoints={state.search.drawing.map(coordToPoint)}
      />
    </>
  )
}
