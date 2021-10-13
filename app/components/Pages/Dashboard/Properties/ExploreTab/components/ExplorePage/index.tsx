import { useState, useCallback, useRef } from 'react'

import { Grid, makeStyles } from '@material-ui/core'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { appSidenavWidth } from '@app/components/Pages/Dashboard/SideNav/variables'
import { useQueryParam } from '@app/hooks/use-query-param'
import { confirmation } from '@app/store_actions/confirmation'
import { setUserSetting } from '@app/store_actions/user/set-setting'
import {
  GoogleMapLibrary,
  isMapLibrariesLoaded,
  loadMapLibraries
} from '@app/utils/google-map-api'

import { Map } from '../../../components/Map'
import CreateAlertModal from '../../../components/modals/CreateAlertModal'
import { Header } from '../../../components/PageHeader'
import { ShareListings } from '../../../components/ShareListings'
import Tabs from '../../../components/Tabs'
import { QUERY_LIMIT, bootstrapURLKeys } from '../../../constants'
import { createValertOptions } from '../../../helpers/get-listings-helpers'
import { coordToPoint } from '../../../helpers/map-helpers'
import {
  LAST_BROWSING_LOCATION,
  parseSortIndex,
  SORT_FIELD_SETTING_KEY
} from '../../../helpers/sort-utils'
import { SortString, ViewType } from '../../../types'
import {
  setMapDrawing,
  removeMapDrawing,
  setMapBounds,
  setMapLocation,
  changeSort,
  changeListingHoverState,
  changeListingClickedState
} from '../../context/actions'
import useListingsContext from '../../hooks/useListingsContext'
import Autocomplete from '../Autocomplete'
import { Filters } from '../Filters'
import { Results } from '../Results'
import { SaveSearchButton } from '../SaveSearchButton'

const useStyles = makeStyles(
  theme => ({
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    searchBar: {
      paddingBottom: theme.spacing(3),
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    searchBarSearchItem: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    searchBarFilterItem: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginLeft: 'auto',
      alignItems: 'stretch'
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
    hidden: {
      display: 'none'
    },
    mapCanvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden'
    },
    mapToggler: {
      position: 'absolute',
      top: 5,
      left: 5,
      backgroundColor: '#fff',
      padding: theme.spacing(1, 2),
      borderRadius: theme.shape.borderRadius,
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
      zIndex: theme.zIndex.modal - 3,
      width: `calc(100% - ${appSidenavWidth}px)`
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
  onClickLocate: () => void
}

export function ExplorePage({ user, isWidget, onClickLocate }: Props) {
  const [state, dispatch] = useListingsContext()
  const [viewQueryParam] = useQueryParam('view')
  const classes = useStyles()

  const reduxDispatch = useDispatch()
  const mapRef = useRef<google.maps.Map>()
  const [mapIsShown, setMapIsShown] = useState(true)
  const [mapIsInitialized, setMapIsInitialized] = useState(false)
  const [isShowAlertModal, setIsShowAlertModal] = useState(false)
  const [viewType, setViewType] = useState<ViewType>(
    (viewQueryParam as ViewType) || 'cards'
  )

  const onChangeSort = (sort: SortString) => {
    dispatch(changeSort(parseSortIndex(sort)))
    reduxDispatch(setUserSetting(SORT_FIELD_SETTING_KEY, sort))
  }

  const onToggleView = (to: ViewType) => {
    setViewType(to)
  }

  const onRemoveDrawing = () => {
    dispatch(removeMapDrawing())
  }

  const onDrawingComplete = useCallback((points: ICoord[]) => {
    dispatch(setMapDrawing(points))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMapShown = () => setMapIsShown(mapIsShown => !mapIsShown)

  const onSelectPlace = (
    center: ICoord,
    zoom: number,
    bounds: ICompactBounds
  ) => {
    if (viewType === 'cards') {
      dispatch(setMapLocation(center, zoom))
    } else {
      dispatch(setMapBounds(center, zoom, bounds))
    }

    if (mapRef.current) {
      const cornerBounds = new window.google.maps.LatLngBounds()

      cornerBounds.extend(new google.maps.LatLng(bounds.ne.lat, bounds.ne.lng))
      cornerBounds.extend(new google.maps.LatLng(bounds.sw.lat, bounds.sw.lng))

      mapRef.current.fitBounds(cornerBounds)
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

  const onMapChange = useCallback(
    (center: ICoord, zoom: number, bounds: IBounds) => {
      dispatch(setMapBounds(center, zoom, bounds))

      // Anonymous user's can also see /mls and explore the map
      // So updatingLastBrowsing location should not be run for them
      if (user) {
        reduxDispatch(setUserSetting(LAST_BROWSING_LOCATION, { center, zoom }))
      }
    },
    [dispatch, user, reduxDispatch]
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

  const changeHoverState = (id: UUID, hover: boolean) => {
    dispatch(changeListingHoverState(hover ? id : null))
  }

  const onStartDrawingMode = () => {
    dispatch(changeListingHoverState(null))
    dispatch(changeListingClickedState(null))
  }

  const onOpenListingModal = (id: UUID) => {
    if (!isWidget) {
      window.history.pushState({}, '', `/dashboard/properties/${id}`)
    }
  }

  const onCloseListingModal = () => {
    if (!isWidget) {
      window.history.pushState({}, '', '/dashboard/properties')
    }
  }

  const onMarkerClick = (key: UUID) => {
    const resultElement = document.getElementById(key)

    if (resultElement) {
      // Smooth scrolling doesn't work on Chrome for some reason
      resultElement.scrollIntoView({ behavior: 'smooth' })
    }

    dispatch(changeListingClickedState(key))
  }

  const onMapClick = () => dispatch(changeListingClickedState(null))

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map
  }

  return (
    <>
      <Grid className={classes.container}>
        <Header title="Properties" />
        <Tabs user={user} isWidget={isWidget} />
        <Grid className={classes.searchBar}>
          <Grid className={classes.searchBarSearchItem}>
            <Autocomplete
              isMapView={mapIsShown}
              onSelectPlace={onSelectPlace}
            />
          </Grid>
          <Grid className={classes.searchBarFilterItem}>
            <Filters />
            <SaveSearchButton
              isLoading={state.isLoading}
              onClick={handleSaveSearch}
            />
          </Grid>
        </Grid>

        <Grid container className={classes.main}>
          {mapIsInitialized && (
            <Grid
              item
              className={cn({
                [classes.map]: true,
                [classes.hidden]: !mapIsShown
              })}
            >
              <Grid className={classes.mapCanvas}>
                <Map
                  isWidget={isWidget}
                  hasDrawingMode
                  drawing={state.search.drawing}
                  onStartDrawingMode={onStartDrawingMode}
                  onDrawingComplete={onDrawingComplete}
                  onRemoveDrawing={onRemoveDrawing}
                  onChange={onMapChange}
                  mapIsShown={mapIsShown}
                  onClickLocate={onClickLocate}
                  onClickToggleMap={toggleMapShown}
                  onChangeHoverState={changeHoverState}
                  onCloseListingModal={onCloseListingModal}
                  onOpenListingModal={onOpenListingModal}
                  onMarkerClick={onMarkerClick}
                  onMapClick={onMapClick}
                  mapPosition={state.map}
                  listings={state.result.listings}
                  hoverListing={state.listingStates.hover}
                  clickedListing={state.listingStates.click}
                  onMapLoad={onMapLoad}
                />
              </Grid>
            </Grid>
          )}
          <Grid item className={classes.results}>
            <Results
              mapIsShown={mapIsShown}
              onMapToggle={toggleMapShown}
              viewType={viewType}
              onChangeSort={onChangeSort}
              activeSort={state.search.sort}
              onToggleView={onToggleView}
              isWidget={isWidget}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.selectionActionBar}>
        <ShareListings />
      </Grid>
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
