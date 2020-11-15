import React from 'react'
import Box from '@material-ui/core/Box'

import { SingleMarkerMap } from 'components/maps/SingleMarkerMap'

interface Props {
  location: ILocation
}

function Map({ location }: Props) {
  return (
    <Box py={5} id="map" height="50vh" width="100%">
      <SingleMarkerMap
        id="listingMap"
        location={location}
        options={{ zoom: 18 }}
      />
    </Box>
  )
}

export default Map
