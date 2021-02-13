import React, { useRef } from 'react'
import classNames from 'classnames'
import mapboxgl, { Map, MapboxOptions, Marker, MapEventType } from 'mapbox-gl'
import { useEffectOnce } from 'react-use'

import config from 'config'

import useMapEvent from './use-map-event'
import useSyncMapProp from './use-sync-map-prop'
import useStyles, { StyleProps } from './styles'

export interface InitialMapboxOptions
  extends Omit<MapboxOptions, 'container' | 'center'>,
    Required<Pick<MapboxOptions, 'center'>> {}

export type CenterChangeEvent = MapEventType['moveend']
export type ZoomChangeEvent = MapEventType['zoomend']

export interface MapboxProps extends StyleProps {
  className?: string
  initialOptions: InitialMapboxOptions
  // The style prop name is reserved by React.js
  // You have to use theme prop instead
  theme?: MapboxOptions['style']
  center?: MapboxOptions['center']
  zoom?: MapboxOptions['zoom']
  onCenterChange?: (event: CenterChangeEvent) => void
  onZoomChange?: (event: ZoomChangeEvent) => void
  hasCenterMarker?: boolean
}

function Mapbox({
  className,
  width,
  height,
  onCenterChange,
  onZoomChange,
  initialOptions,
  theme,
  center,
  zoom,
  hasCenterMarker = true
}: MapboxProps) {
  const classes = useStyles({ width, height })
  const divRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const markerRef = useRef<Marker | null>(null)

  useEffectOnce(() => {
    if (divRef.current) {
      console.log('config', config)
      mapboxgl.accessToken = config.mapbox.access_token

      mapRef.current = new mapboxgl.Map({
        ...initialOptions,
        container: divRef.current
      })

      if (hasCenterMarker) {
        markerRef.current = new mapboxgl.Marker()
          .setLngLat(initialOptions.center)
          .addTo(mapRef.current)

        mapRef.current?.on('move', event => {
          markerRef.current?.setLngLat(event.target.getCenter())
        })
      }
    }

    return () => {
      markerRef.current?.remove()
      mapRef.current?.remove()
    }
  })

  useMapEvent(mapRef, 'moveend', onCenterChange)
  useMapEvent(mapRef, 'zoomend', onZoomChange)

  useSyncMapProp(mapRef.current?.setStyle, theme)
  useSyncMapProp(mapRef.current?.setCenter, center)
  useSyncMapProp(mapRef.current?.setZoom, zoom)

  return (
    <>
      <div className={classNames(classes.root, className)} ref={divRef} />
      <link
        href="https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css"
        rel="stylesheet"
      />
    </>
  )
}

export default Mapbox
