import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

interface Location {
  pathname: string
}

export function useAppcues() {
  const location = useSelector<IAppState, Location | null>(
    state => state.data.location
  )

  const pathname = location ? location.pathname : null

  useEffect(() => {
    if (!pathname) {
      return
    }

    // TODO: Use appcuse method
    console.log(pathname)
  }, [pathname])
}
