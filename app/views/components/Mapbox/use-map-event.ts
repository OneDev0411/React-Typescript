import { MapEventType, EventData, Map } from 'mapbox-gl'
import { MutableRefObject, useEffect } from 'react'

function useMapEvent<T extends keyof MapEventType>(
  mapRef: MutableRefObject<Map | null>,
  type: T,
  listener?: (ev: MapEventType[T] & EventData) => void
) {
  useEffect(() => {
    const map = mapRef.current

    if (listener) {
      map?.on(type, listener)
    }

    return () => {
      if (listener) {
        map?.off(type, listener)
      }
    }
  }, [mapRef, type, listener])
}

export default useMapEvent
