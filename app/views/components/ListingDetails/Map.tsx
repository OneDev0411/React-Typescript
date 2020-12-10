import React from 'react'
import Box from '@material-ui/core/Box'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { SingleMarkerMap } from 'components/maps/SingleMarkerMap'

interface Props {
  location: ILocation
}

function Map({ location }: Props) {
  const isWindowTall = useMediaQuery('(min-height:800px)')

  return (
    <Box id="listing-map" height={isWindowTall ? '20vh' : '50vh'} width="100%">
      <SingleMarkerMap
        id="listingMap"
        location={location}
        options={{ zoom: 18 }}
      />
    </Box>
  )
}

export default Map
