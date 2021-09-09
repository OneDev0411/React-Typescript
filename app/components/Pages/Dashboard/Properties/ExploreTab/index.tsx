import { useState } from 'react'

import { makeStyles } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { WithRouterProps } from 'react-router'
import { useEffectOnce } from 'react-use'

import { getPlace } from '@app/models/listings/search/get-place'
import { confirmation } from 'actions/confirmation'
import { AnimatedLoader } from 'components/AnimatedLoader'
import GlobalPageLayout from 'components/GlobalPageLayout'
import { getLocationErrorMessage } from 'utils/map'

import { FILTERS_INITIAL_VALUES } from '../constants/constants'
import { getUserLastBrowsingLocation } from '../helpers/sort-utils'

import { ExplorePage } from './components/ExplorePage'
import { LandingPage } from './components/LandingPage'
import { ListingsContext } from './context'
import { setMapLocation } from './context/actions'
import useFetchListings from './hooks/useFetchListings'

const useStyles = makeStyles(
  () => ({
    exploreContainer: {
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
      paddingTop: 0,
      paddingBottom: 0
    }
  }),
  { name: 'ExploreTab' }
)

interface Props extends WithRouterProps {
  user: IUser
  isWidget: boolean
}

function ExploreTab({ isWidget, user, location }: Props) {
  const classes = useStyles()

  const reduxDispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState<string>(location.query.q || '')
  const brokerageQuery = location.query.brokerage || ''

  const hasUrlQuery = !!(brokerageQuery || searchQuery)

  const userLastBrowsingLocation = getUserLastBrowsingLocation(user)

  const initialState = {
    search: {
      bounds: null,
      ...(brokerageQuery ? { office: brokerageQuery } : {}),
      drawing: [],
      filters: FILTERS_INITIAL_VALUES
    },
    map: userLastBrowsingLocation
  }

  const [state, dispatch] = useFetchListings(initialState)

  const [isLoadingPlace, setIsLoadingPlace] = useState(false)

  const [userLocationState, setUserLocationState] = useState({
    isGettingCurrentPosition: false,
    userLastBrowsingLocation,
    firstRun:
      typeof userLastBrowsingLocation === 'undefined' ||
      Object.keys(userLastBrowsingLocation).length === 0
  })

  const onClickLocate = () => {
    if (!window.navigator.geolocation) {
      return reduxDispatch(
        confirmation({
          confirmLabel: 'OK',
          message: 'Your device does not support Geolocation',
          hideCancelButton: true
        })
      )
    }

    setUserLocationState(prev => ({ ...prev, isGettingCurrentPosition: true }))

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        initUserLocation(lat, lng)
      },
      error => {
        console.log(error)
        console.log(getLocationErrorMessage(error))
        setUserLocationState(prev => ({
          ...prev,
          isGettingCurrentPosition: false
        }))
        reduxDispatch(
          confirmation({
            confirmLabel: 'OK',
            message: 'Your location is disabled',
            description:
              'Please check your browser’s setting and make sure ' +
              'your location sharing is on.',
            hideCancelButton: true
          })
        )
      },
      { timeout: 10000 }
    )
  }

  // Initialize user location on click Locate
  const initUserLocation = (lat: number, lng: number) => {
    // TODO: Calculate zoom from bound and center and map width
    // https://stackoverflow.com/a/6055653/10326226
    const zoom = 15
    const center = { lat, lng }

    dispatch(setMapLocation(center, zoom))
    setUserLocationState(prev => ({
      ...prev,
      firstRun: false,
      isGettingCurrentPosition: false,
      userLastBrowsingLocation: {
        zoom,
        center
      }
    }))
  }

  const onSelectPlace = (center: ICoord, zoom: number) => {
    dispatch(setMapLocation(center, zoom))
    setSearchQuery(window.location.search.substring(3))
    setUserLocationState(prev => ({ ...prev, firstRun: false }))
  }

  // Get google geo place if query is set
  useEffectOnce(() => {
    async function parseSearchParam(searchParamQuery: string) {
      setIsLoadingPlace(true)

      try {
        const placeResponse = await getPlace(searchParamQuery, false)

        if (placeResponse) {
          // @types/googlemaps describe the Javascript API not the JSON object on the response
          // there a sublte difference like lat/lng beeing number not functions,
          // So making this `as any as ICoord` cast necessary
          let center = placeResponse.geometry.location as any as ICoord

          // TODO: Calculate zoom from bound and center and map width
          // https://stackoverflow.com/a/6055653/10326226
          const zoom = 16

          console.log(placeResponse)

          dispatch(setMapLocation(center, zoom))
        }
      } finally {
        setIsLoadingPlace(false)
      }
    }

    // In the case of a search query, we must first get the correct location.
    if (searchQuery) {
      parseSearchParam(searchQuery)
    }
  })

  return (
    <GlobalPageLayout className={classes.exploreContainer}>
      {!isLoadingPlace ? (
        <ListingsContext.Provider value={[state, dispatch]}>
          {userLocationState.firstRun && !hasUrlQuery && !isWidget ? (
            <LandingPage
              isGettingCurrentPosition={
                userLocationState.isGettingCurrentPosition
              }
              onClickLocate={onClickLocate}
              onSelectPlace={onSelectPlace}
            />
          ) : (
            <ExplorePage user={user} isWidget={isWidget} />
          )}
        </ListingsContext.Provider>
      ) : (
        <AnimatedLoader />
      )}
    </GlobalPageLayout>
  )
}

export default ExploreTab
