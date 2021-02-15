import React, { useState } from 'react'

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
  const [center] = useState<CenterPoint>(
    map
      ? {
          lng: map.get('longitude') as number,
          lat: map.get('latitude') as number
        }
      : defaultCenter
  )
  const [theme, setTheme] = useState<string>(
    map?.get('theme') ?? mapThemes[0].style
  )

  const handleConfirm = () => {
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
        <Button
          // disabled={!modelId}
          color="primary"
          variant="contained"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}

export default MapEditorDialog
