import React from 'react'
import AppStore from '../../../../stores/AppStore'
import SearchMap from '../../Dashboard/Listings/Search'

const MapWidget = () => {
  AppStore.data.is_widget = true

  return (
    <div className="l-listings is-widget">
      <SearchMap isWidget />
    </div>
  )
}

export default MapWidget
