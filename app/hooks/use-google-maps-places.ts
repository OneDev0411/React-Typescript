import { useEffect } from 'react'

import config from 'config'
import uuid from 'utils/uuid'
import { loadJS, unloadJS } from 'utils/load-js'

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
