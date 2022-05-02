import { useState, useCallback, useRef, useEffect } from 'react'

import { Grid, makeStyles } from '@material-ui/core'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { appSidenavWidth } from '@app/components/Pages/Dashboard/SideNav/variables'
import { useQueryParam } from '@app/hooks/use-query-param'
import { setActiveTeamSetting } from '@app/store_actions/active-team'
import { changeUrl } from '@app/utils/change-url'
import {
  GoogleMapLibrary,
  isMapLibrariesLoaded,
  loadMapLibraries
} from '@app/utils/google-map-api'

import { Map } from '../../../components/Map'
import { Header } from '../../../components/PageHeader'
import { ShareListings } from '../../../components/ShareListings'
import Tabs from '../../../components/Tabs'
import { bootstrapURLKeys, DEFAULT_VIEW } from '../../../constants'
import {
  changeListingHoverState,
  changeListingClickedState,
  clearListingUiStates
} from '../../../context/actions'
import useUiListingsContext from '../../../context/useUiListingsContext'
import {
  parseSortIndex,
  SORT_FIELD_DEFAULT,
  SORT_FIELD_SETTING_KEY
} from '../../../helpers/sort-utils'
import { SortString, ViewType } from '../../../types'
import { setMapLocation, removeListing } from '../../context/actions'
import useFavoritesContext from '../../hooks/useFavoritesContext'
import { Results } from '../Results'

const useStyles = makeStyles(
  theme => ({
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
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
  { name: 'PropertiesFavoritesPage' }
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

export function FavoritesPage({ user, isWidget, onClickLocate }: Props) {
  const [state, dispatch] = useFavoritesContext()
  const [, uiDispatch] = useUiListingsContext()

  const mapRef = useRef<google.maps.Map>()
  const isMapFitRef = useRef<boolean>(false)

  const [viewQueryParam] = useQueryParam('view')
  const classes = useStyles()

  const reduxDispatch = useDispatch()
  const [sort, setSort] = useState(parseSortIndex(SORT_FIELD_DEFAULT))
  const [mapIsShown, setMapIsShown] = useState(true)
  const [mapIsInitialized, setMapIsInitialized] = useState(false)
  const [viewType, setViewType] = useState<ViewType>(
    (viewQueryParam as ViewType) || DEFAULT_VIEW
  )

  const onChangeSort = (sort: SortString) => {
    setSort(parseSortIndex(sort))
    reduxDispatch(setActiveTeamSetting(SORT_FIELD_SETTING_KEY, sort))
  }

  const onToggleView = (to: ViewType) => {
    setViewType(to)
  }

  const toggleMapShown = useCallback(() => {
    setMapIsShown(mapIsShown => !mapIsShown)
    uiDispatch(changeListingClickedState(null))
  }, [uiDispatch])

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
    (center: ICoord, zoom: number) => {
      dispatch(setMapLocation(center, zoom))
    },
    [dispatch]
  )

  const changeHoverState = useCallback(
    (id: UUID, hover: boolean) => {
      uiDispatch(changeListingHoverState(hover ? id : null))
    },
    [uiDispatch]
  )

  const onToggleFavorite = useCallback(
    (id: UUID) => {
      dispatch(removeListing(id))
    },
    [dispatch]
  )

  const onToggleListingModal = useCallback(
    (id: UUID, isOpen: boolean) => {
      uiDispatch(clearListingUiStates())

      if (!isWidget) {
        if (isOpen) {
          changeUrl(`/dashboard/mls/${id}`)
        } else {
          // Inject view param to url
          const viewQueryParam =
            viewType !== DEFAULT_VIEW ? { view: viewType } : {}

          changeUrl('/dashboard/mls/favorites', viewQueryParam)
        }
      }
    },
    [isWidget, uiDispatch, viewType]
  )

  const onMarkerClick = useCallback(
    (key: UUID) => {
      const resultElement = document.getElementById(key)

      if (resultElement) {
        // Smooth scrolling doesn't work on Chrome for some reason
        resultElement.scrollIntoView({ behavior: 'smooth' })
      }

      uiDispatch(changeListingClickedState(key))
    },
    [uiDispatch]
  )

  const handleHidingMapMarkerPopup = useCallback(() => {
    uiDispatch(changeListingClickedState(null))
  }, [uiDispatch])

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  useEffect(() => {
    if (!isMapFitRef.current && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds()

      state.result.listings.forEach(item => {
        if (item.location) {
          bounds.extend(
            new google.maps.LatLng(
              item.location.latitude,
              item.location.longitude
            )
          )
        }
      })

      mapRef.current.fitBounds(bounds)
      isMapFitRef.current = true
    }
  }, [state.result.listings])

  return (
    <>
      <Grid className={classes.container}>
        <Header title="Favorites" />
        <Tabs user={user} isWidget={isWidget} />

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
                  onChange={onMapChange}
                  mapIsShown={mapIsShown}
                  onClickLocate={onClickLocate}
                  onClickToggleMap={toggleMapShown}
                  onChangeHoverState={changeHoverState}
                  onToggleListingModal={onToggleListingModal}
                  onMarkerClick={onMarkerClick}
                  onMapClick={handleHidingMapMarkerPopup}
                  onMapDrag={handleHidingMapMarkerPopup}
                  mapPosition={state.map}
                  listings={state.result.listings}
                  onToggleFavorite={onToggleFavorite}
                  closeModalAfterToggleFavorite
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
              activeSort={sort}
              onToggleView={onToggleView}
              isWidget={isWidget}
              onToggleListingModal={onToggleListingModal}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.selectionActionBar}>
        <ShareListings />
      </Grid>
    </>
  )
}
