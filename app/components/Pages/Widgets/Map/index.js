import React from 'react'
import AppStore from '../../../../stores/AppStore'

import SearchMap from '../../Dashboard/Listings/Search'
import BrandLogo from '../../Dashboard/Listings/Listing/components/BrandLogo'

const MapWidget = () => {
  AppStore.data.is_widget = true

  return (
    <div className="l-listings">
      <header className="l-listings__header">
        <BrandLogo
          isWidget
          data={AppStore.data}
          styles={{ padding: '.9rem 2rem' }}
        />
      </header>
      <SearchMap isWidget />
    </div>
  )
}

export default MapWidget
