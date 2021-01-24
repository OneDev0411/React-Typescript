import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { selectUserUnsafe } from 'selectors/user'

import { IAppState } from 'reducers'

interface Location {
  pathname: string
}

export function useAppcues() {
  const location = useSelector<IAppState, Location | null>(
    state => state.data.location
  )
  const user = useSelector(selectUserUnsafe)

  const pathname = location ? location.pathname : null

  useEffect(() => {
    if (!pathname) {
      return
    }

    if (user && user.id) {
      // Behind the scenes, this call also invokes Appcues.page()
      // More: https://docs.appcues.com/article/161-javascript-api
      window.Appcues.identify(user.id, {
        firstName: user.first_name,
        lastName: user.last_name,
        userType: user.user_type
      })
    }
  }, [pathname, user])
}
