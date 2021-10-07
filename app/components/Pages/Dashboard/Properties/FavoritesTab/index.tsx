import { makeStyles } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { WithRouterProps } from 'react-router'

import { confirmation } from 'actions/confirmation'
import GlobalPageLayout from 'components/GlobalPageLayout'
import { getLocationErrorMessage } from 'utils/map'

import { USER_LOCATION_ZOOM_LEVEL } from '../constants'
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

  const reduxDispatch = useDispatch()
  const userLastBrowsingLocation = getUserLastBrowsingLocation(user)

  const initialState = {
    map: userLastBrowsingLocation
  }

  const [state, dispatch] = useFetchFavorites(initialState)

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
  }

  // Initialize user location on click Locate
  const initUserLocation = (lat: number, lng: number) => {
    const zoom = USER_LOCATION_ZOOM_LEVEL
    const center = { lat, lng }

    dispatch(setMapLocation(center, zoom))
  }

  return (
    <GlobalPageLayout className={classes.exploreContainer}>
      <FavoritesContext.Provider value={[state, dispatch]}>
        <FavoritesPage
          user={user}
          isWidget={isWidget}
          onClickLocate={onClickLocate}
        />
      </FavoritesContext.Provider>
    </GlobalPageLayout>
  )
}

export default FavoritesTab
