// Partials/MlsMap.js
import React, { Component } from 'react'
import S from 'shorti'
import controller from '../../controller'
import ListingMarker from '../../Partials/ListingMarker'
import GoogleMap from 'google-map-react'
import config from '../../../../../../config/public'
export default class MlsMap extends Component {
  render() {
    const data = this.props.data
    const listing_map = data.listing_map
    const alerts_map = data.alerts_map
    let map_listing_markers
    if (data.show_search_map && listing_map && listing_map.listings) {
      let listings = listing_map.listings
      listings = listings.filter(listing => {
        return listing.location
      })
      map_listing_markers = listings.map(listing => {
        return (
          <div
            onMouseOver={ controller.listing_map.showListingPopup.bind(this, listing) }
            onMouseOut={ controller.listing_map.hideListingPopup.bind(this) }
            key={ 'search-map--map-listing-' + listing.id }
            onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) }
            style={ S('pointer mt-10') }
            lat={ listing.location.latitude }
            lng={ listing.location.longitude }
            text={'A'}
          >
            <ListingMarker
              key={ 'listing-marker-' + listing.id }
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
    if (data.show_alerts_map && alerts_map && alerts_map.listings) {
      let listings = alerts_map.listings
      listings = listings.filter(listing => {
        return listing.location
      })
      map_listing_markers = listings.map(listing => {
        return (
          <div
            onMouseOver={ controller.listing_map.showListingPopup.bind(this, listing) }
            onMouseOut={ controller.listing_map.hideListingPopup.bind(this) }
            key={ 'alert-map--map-listing-' + listing.id }
            onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) }
            style={ S('pointer mt-10') }
            lat={ listing.location.latitude }
            lng={ listing.location.longitude }
            text={'A'}
          >
            <ListingMarker
              key={ 'listing-marker-' + listing.id }
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
    if (data.show_actives_map && data.active_listings) {
      let listings = data.active_listings
      listings = listings.filter(listing => {
        if (listing.property && listing.property.address)
          return listing.property.address.location
      })
      map_listing_markers = listings.map((listing, i) => {
        return (
          <div
            onMouseOver={ controller.listing_map.showListingPopup.bind(this, listing) }
            onMouseOut={ controller.listing_map.hideListingPopup.bind(this) }
            key={ 'actives-map--map-listing-' + listing.id + '-' + i }
            onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) }
            style={ S('pointer mt-10') }
            lat={ listing.property.address.location.latitude }
            lng={ listing.property.address.location.longitude }
            text={'A'}
          >
            <ListingMarker
              key={ 'listing-marker-' + listing.id }
              data={ data }
              listing={ listing }
              property={ listing.property }
              address={ listing.property.address }
              context={ 'map' }
            />
          </div>
        )
      })
    }
    const default_center = {
      lat: 32.7767,
      lng: -96.7970
    }
    const default_zoom = 13
    const bootstrap_url_keys = {
      key: config.google.api_key,
      libraries: ['drawing', 'places'].join(',')
    }
    let map_id
    if (listing_map && listing_map.map_id)
      map_id = listing_map.map_id
    // Pinpoint
    if (map_listing_markers && listing_map.has_location_search) {
      const pinpoint = (
        <div
          key="center-marker"
          style={ S('pointer mt-10') }
          lat={ listing_map.location_search.center.lat }
          lng={ listing_map.location_search.center.lng }
          text={'Hello!'}
        ><img style={ S('h-30') } src="/images/dashboard/mls/map-pin.svg"/>
        </div>
      )
      map_listing_markers.push(pinpoint)
    }
    return (
      <GoogleMap
        key={ 'map-' + map_id }
        bootstrapURLKeys={ bootstrap_url_keys }
        center={ listing_map ? listing_map.center : default_center }
        zoom={ listing_map ? listing_map.zoom : default_zoom }
        onBoundsChange={ controller.listing_map.handleBoundsChange.bind(this) }
        options={ controller.listing_map.createMapOptions.bind(this) }
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={ controller.listing_map.handleGoogleMapApi.bind(this) }
      >
        { map_listing_markers }
      </GoogleMap>
    )
  }
}
MlsMap.propTypes = {
  data: React.PropTypes.object
}