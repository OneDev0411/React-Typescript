// Partials/ListingMarkers.js
import React, { Component } from 'react'
import S from 'shorti'
import controller from '../../controller'
import ListingMarker from '../../Partials/ListingMarker'
export default class ListingMarkers extends Component {
  render() {
    const data = this.props.data
    let listings = this.props.listings
    listings = listings.filter(listing => {
      return listing.location
    })
    return listings.map(listing => {
      return (
        <div onMouseOver={ controller.listing_map.showListingPopup.bind(this, listing) } onMouseOut={ controller.listing_map.hideListingPopup.bind(this) } key={ 'map-listing-' + listing.id } onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) } style={ S('pointer mt-10') } lat={ listing.location.latitude } lng={ listing.location.longitude } text={'A'}>
          <ListingMarker
            key={ 'listing-marker' + listing.id }
            data={ data }
            listing={ listing }
            property={ listing.compact_property }
            address={ listing.address }
            context={ 'map' }
          />
        </div>
      )
    })
  }
}
ListingMarkers.propTypes = {
  data: React.PropTypes.object,
  listings: React.PropTypes.object
}