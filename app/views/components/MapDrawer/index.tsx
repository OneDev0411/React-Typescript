import React, { useEffect, useState } from 'react'
import type { Model } from 'backbone'

import { Button, Box } from '@material-ui/core'

import OverlayDrawer from 'components/OverlayDrawer'

import ListingsAndPlacesSearchInput from 'components/ListingsAndPlacesSearchInput'

import { SearchResult } from 'components/ListingsAndPlacesSearchInput/types'

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

  // The search field is required if there is no location in the template
  const hasSearchField = !initialCenter

  // The type prop is undefined when a new block is dropped into the editor
  const isNewBlock = !map?.get('type')

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

  const handleSearch = (result: SearchResult) => {
    if (result.type === 'listing') {
      // @TODO: implement this when the related API error is fixed
      console.log('############', result.listing.address)
    } else if (result.type === 'place') {
      const location = result.place.geometry.location

      setCenter({
        longitude: location.lng as any,
        latitude: location.lat as any
      })
    }
  }

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

  const handleClose = () => {
    onClose?.()
  }

  return (
    <OverlayDrawer open={isOpen} onClose={handleClose}>
      <OverlayDrawer.Header title="Insert a Map block" />
      <OverlayDrawer.Body>
        <Box marginTop={3}>
          {hasSearchField && isNewBlock && (
            <ListingsAndPlacesSearchInput onSelect={handleSearch} />
          )}
          <MapThemeList theme={theme} onChange={setTheme} center={center} />
        </Box>
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
