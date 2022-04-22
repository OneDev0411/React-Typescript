import { useCallback, useReducer } from 'react'

import { makeStyles } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { WithRouterProps } from 'react-router'
import { useEffectOnce } from 'react-use'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { confirmation } from '@app/store_actions/confirmation'
import { goTo } from '@app/utils/go-to'
import { getLocationErrorMessage } from '@app/utils/map'
import GlobalPageLayout from '@app/views/components/GlobalPageLayout'

import { USER_LOCATION_ZOOM_LEVEL } from '../constants'
import { ListingsUiContext } from '../context'
import { reducer as uiReducer } from '../context/reducers'
import { getUserLastBrowsingLocation } from '../helpers/sort-utils'

import { FavoritesPage } from './components/FavoritesPage'
import { FavoritesContext } from './context'
import { setMapLocation } from './context/actions'
import useFetchFavorites from './hooks/useFetchFavorites'

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
  { name: 'FavoritesTab' }
)

interface Props extends WithRouterProps {
  user: IUser
  isWidget: boolean
}

function FavoritesTab({ isWidget, user }: Props) {
  const classes = useStyles()
  const activeTeam = useUnsafeActiveTeam()

  const reduxDispatch = useDispatch()
  const userLastBrowsingLocation = getUserLastBrowsingLocation(activeTeam)

  const initialState = {
    map: userLastBrowsingLocation
  }

  const [state, dispatch] = useFetchFavorites(initialState)
  const [uiState, uiDispatch] = useReducer(uiReducer, {
    hover: null,
    click: null
  })

  // Initialize user location on click Locate
  const initUserLocation = useCallback(
    (lat: number, lng: number) => {
      const zoom = USER_LOCATION_ZOOM_LEVEL
      const center = { lat, lng }

      dispatch(setMapLocation(center, zoom))
    },
    [dispatch]
  )

  const onClickLocate = useCallback(() => {
    if (!window.navigator.geolocation) {
      return reduxDispatch(
        confirmation({
          confirmLabel: 'OK',
          message: 'Your device does not support Geolocation',
          hideCancelButton: true
        })
      )
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        initUserLocation(lat, lng)
      },
      error => {
        console.log(error)
        console.log(getLocationErrorMessage(error))
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
  }, [initUserLocation, reduxDispatch])

  // Redirect to landing page if it's users's first MLS run
  // https://gitlab.com/rechat/web/-/issues/6108
  useEffectOnce(() => {
    if (!userLastBrowsingLocation) {
      goTo('/dashboard/mls')
    }
  })

  return (
    <GlobalPageLayout className={classes.exploreContainer}>
      <FavoritesContext.Provider value={[state, dispatch]}>
        <ListingsUiContext.Provider value={[uiState, uiDispatch]}>
          {userLastBrowsingLocation && (
            <FavoritesPage
              user={user}
              isWidget={isWidget}
              onClickLocate={onClickLocate}
            />
          )}
        </ListingsUiContext.Provider>
      </FavoritesContext.Provider>
    </GlobalPageLayout>
  )
}

export default FavoritesTab
