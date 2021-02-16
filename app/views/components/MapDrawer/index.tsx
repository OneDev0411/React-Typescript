import React, { useEffect, useState } from 'react'

import { Button } from '@material-ui/core'

import type { Model } from 'backbone'

import OverlayDrawer from 'components/OverlayDrawer'

import { mapThemes } from './constants'
import MapThemeList from './MapThemeList'
import { CenterPoint } from './types'

export interface MapInfo {
  center: CenterPoint
  theme: string
  zoom: number
}

export interface MapEditorDialogProps {
  isOpen: boolean
  map: Model | null
  onClose?: () => void
  onSelect: (info: MapInfo) => void
}

const defaultCenter = { lng: -107.7910942, lat: 50.2867731 }

function MapEditorDialog({
  isOpen,
  onClose,
  onSelect,
  map
}: MapEditorDialogProps) {
  const modelLng = (map?.get('longitude') as number) || defaultCenter.lng
  const modelLat = (map?.get('latitude') as number) || defaultCenter.lat
  const modelTheme = map?.get('theme') ?? mapThemes[0].style

  const [center, setCenter] = useState<CenterPoint>(defaultCenter)
  const [theme, setTheme] = useState<string>(modelTheme)

  useEffect(() => {
    setCenter({
      lng: modelLng,
      lat: modelLat
    })
  }, [modelLng, modelLat])

  useEffect(() => {
    setTheme(modelTheme)
  }, [modelTheme])

  const handleConfirm = () => {
    map?.trigger('change:map:info', {
      longitude: center.lng,
      latitude: center.lat,
      theme
    })
    onSelect({
      center,
      theme,
      zoom: 15
    })
  }

  return (
    <OverlayDrawer open={isOpen} onClose={() => onClose?.()}>
      <OverlayDrawer.Header title="Insert a Map block" />
      <OverlayDrawer.Body>
        <MapThemeList theme={theme} onChange={setTheme} center={center} />
      </OverlayDrawer.Body>
      <OverlayDrawer.Footer rowReverse>
        <Button color="primary" variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}

export default MapEditorDialog
