import React, { useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  Button
} from '@material-ui/core'

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
  onConfirm: (info: MapInfo) => void
}

function MapEditorDialog({ onConfirm, ...otherProps }: MapEditorDialogProps) {
  const centerRef = useRef<CenterPoint>({ lng: -107.7910942, lat: 50.2867731 })
  const themeRef = useRef('mapbox://styles/mapbox/streets-v11')
  const zoomRef = useRef(15)

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
