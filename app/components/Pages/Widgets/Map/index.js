import React from 'react'
import SearchMap from '../../Dashboard/Listings/Search'

const MapWidget = props => (
  <div className="l-listings is-widget">
    <SearchMap {...props} isWidget />
  </div>
)

export default MapWidget
