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

export interface MapDrawerProps {
  isOpen: boolean
  map: Model | null
  initialCenter?: CenterPoint
  onClose?: () => void
  onSelect: (info: MapInfo) => void
}

const defaultCenterFallback = { longitude: -107.7910942, latitude: 50.2867731 }

function MapDrawer({
  isOpen,
  onClose,
  onSelect,
  map,
  initialCenter
}: MapDrawerProps) {
  const defaultCenter = initialCenter ?? defaultCenterFallback
  const modelLng = (map?.get('longitude') as number) || defaultCenter.longitude
  const modelLat = (map?.get('latitude') as number) || defaultCenter.latitude
  const modelTheme = map?.get('theme') ?? mapThemes[0].style

  // The search field is required if there is no location in the template
  const hasSearchField = !initialCenter

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
      const location = result.listing.location

      if (location) {
        setCenter({
          longitude: location.longitude,
          latitude: location.latitude
        })
      }
    } else if (result.type === 'place') {
      const location = result.place.geometry.location

      // @TODO: there is a typescript definition issue here
      // I don't know why the location.lng is a function instead
      // of a solid number
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
          {hasSearchField && (
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

export default MapDrawer
