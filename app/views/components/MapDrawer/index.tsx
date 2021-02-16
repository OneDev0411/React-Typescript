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
  initialCenter?: CenterPoint
  onClose?: () => void
  onSelect: (info: MapInfo) => void
}

const defaultCenterFallback = { longitude: -107.7910942, latitude: 50.2867731 }

function MapEditorDialog({
  isOpen,
  onClose,
  onSelect,
  map,
  initialCenter
}: MapEditorDialogProps) {
  const defaultCenter = initialCenter ?? defaultCenterFallback
  const modelLng = (map?.get('longitude') as number) || defaultCenter.longitude
  const modelLat = (map?.get('latitude') as number) || defaultCenter.latitude
  const modelTheme = map?.get('theme') ?? mapThemes[0].style

  const [center, setCenter] = useState<CenterPoint>(defaultCenter)
  const [theme, setTheme] = useState<string>(modelTheme)

  useEffect(() => {
    setCenter({
      longitude: modelLng,
      latitude: modelLat
    })
  }, [modelLng, modelLat])

  useEffect(() => {
    setTheme(modelTheme)
  }, [modelTheme])

  const handleConfirm = () => {
    map?.trigger('change:map:info', {
      longitude: center.longitude,
      latitude: center.latitude,
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
