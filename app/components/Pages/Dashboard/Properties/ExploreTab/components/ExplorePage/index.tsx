import { useState, useCallback } from 'react'

import { Box, Button, Grid, makeStyles } from '@material-ui/core'
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
import { QUERY_LIMIT, bootstrapURLKeys } from '../../../constants/constants'
import { createValertOptions } from '../../../helpers/get-listings-helpers'
import { coordToPoint } from '../../../helpers/map-helpers'
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
  theme => ({
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    searchBar: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(4),
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
      flex: 1,
      minHeight: '100%',
      marginRight: theme.spacing(2),
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
      backgroundColor: '#fff',
      padding: theme.spacing(1, 2),
      borderRadius: 3,
      zIndex: 3
    },
    results: {
      flex: 1,
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    selectionActionBar: {
      position: 'absolute',
      bottom: 20,
      right: 0,
      // The width of app sidebar is 192px
      // TODO: probably need to be changed if sidebar is changed
      width: 'calc(100% - 192px)'
    }
  }),
  { name: 'PropertiesExplorePage' }
)

// Add initialize to window type to avoid TS error on google map callback
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

  const onDoneDrawing = useCallback((points: ICoord[]) => {
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

        <Grid container className={classes.main}>
          {mapIsShown && mapIsInitialized && (
            <Grid item className={classes.map}>
              <Box className={classes.mapCanvas}>
                {!drawingMode && (
                  <>
                    <GoogleMapsButton top={9} left={5} onClick={toggleMap}>
                      <MapToggler checked={mapIsShown} />
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
                  drawingModeCallBack={onDoneDrawing}
                  onChange={updateUserLocation}
                />
              </Box>
            </Grid>
          )}
          <Grid item className={classes.results}>
            <Results
              mapIsShown={mapIsShown}
              onMapToggle={toggleMap}
              viewType={viewType}
              onChangeSort={onChangeSort}
              activeSort={activeSort}
              onToggleView={onToggleView}
              isWidget={isWidget}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.selectionActionBar}>
        <ShareListings />
      </Box>
      <CreateAlertModal
        user={user}
        onHide={onCloseAlertModal}
        isActive={isShowAlertModal}
        alertProposedTitle={state.result.info?.proposed_title}
        searchOptions={createValertOptions(state.search, null, QUERY_LIMIT)}
        drawingPoints={state.search.drawing.map(coordToPoint)}
      />
    </>
  )
}
