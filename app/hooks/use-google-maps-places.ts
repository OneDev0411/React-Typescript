import { useEffect } from 'react'

import config from 'config'
import { loadJS, unloadJS } from 'utils/load-js'
import uuid from 'utils/uuid'

export function useGoogleMapsPlaces() {
  useEffect(() => {
    const id = `google-maps-places-${uuid()}`

    loadJS(
      `https://maps.googleapis.com/maps/api/js?key=${config.google.api_key}&libraries=places`,
      id
    )

    return () => {
      unloadJS(id)
    }
  }, [])
}
