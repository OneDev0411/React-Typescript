import React from 'react'
import { Grid } from '@material-ui/core'

import { mapThemes } from './constants'
import MapThemeItem from './MapThemeItem'
import { CenterPoint } from './types'

interface MapThemeListProps {
  theme: string
  onChange: (theme: string) => void
  center: CenterPoint
}

const markedThemes = mapThemes.filter(theme => theme.marked)

function MapThemeList({ theme, onChange, center }: MapThemeListProps) {
  return (
    <Grid container>
      {markedThemes.map(mapTheme => (
        <Grid item key={mapTheme.style} xs={3}>
          <MapThemeItem
            onClick={() => onChange(mapTheme.style)}
            selected={mapTheme.style === theme}
            center={center}
            name={mapTheme.name}
            theme={mapTheme.style}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default MapThemeList
