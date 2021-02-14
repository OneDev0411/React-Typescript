import React, { useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  Button
} from '@material-ui/core'

import type { Model } from 'backbone'

import LazyMapbox from 'components/LazyMapbox'
import type { CenterChangeEvent, ZoomChangeEvent } from 'components/Mapbox'

export interface CenterPoint {
  lng: number
  lat: number
}

export interface MapInfo {
  center: CenterPoint
  theme: string
  zoom: number
}

export interface MapEditorDialogProps extends DialogProps {
  map: Model | null
  onConfirm: (info: MapInfo) => void
}

const defaultCenter = { lng: -107.7910942, lat: 50.2867731 }
const defaultTheme = 'mapbox://styles/mapbox/streets-v11'
const defaultZoom = 15

function MapEditorDialog({
  onConfirm,
  map,
  ...otherProps
}: MapEditorDialogProps) {
  const centerRef = useRef<CenterPoint>(
    map
      ? { lng: map.get('longitude'), lat: map.get('latitude') }
      : defaultCenter
  )
  const themeRef = useRef(map ? map.get('theme') : defaultTheme)
  const zoomRef = useRef(map ? map.get('zoom') : defaultZoom)

  const handleCenterChange = (event: CenterChangeEvent) => {
    const center = event.target.getCenter()

    centerRef.current = {
      lng: center.lng,
      lat: center.lat
    }
  }

  const handleZoomChange = (event: ZoomChangeEvent) => {
    zoomRef.current = event.target.getZoom()
  }

  const handleConfirm = () => {
    if (map) {
      map.set('longitude', centerRef.current.lng)
      map.set('latitude', centerRef.current.lat)
      map.set('zoom', zoomRef.current)
      map.set('theme', themeRef.current)
    }

    onConfirm({
      center: centerRef.current,
      theme: themeRef.current,
      zoom: zoomRef.current
    })
  }

  return (
    <Dialog {...otherProps} fullWidth>
      <DialogTitle>Map Editor</DialogTitle>
      <DialogContent>
        <LazyMapbox
          initialOptions={{
            style: themeRef.current,
            center: centerRef.current,
            zoom: zoomRef.current
          }}
          onCenterChange={handleCenterChange}
          onZoomChange={handleZoomChange}
        />
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MapEditorDialog
