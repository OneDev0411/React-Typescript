// Dashboard/Mls/index.js
import React, { Component } from 'react'
import S from 'shorti'
import GoogleMap from 'google-map-react'
import listing_util from '../../../../utils/listing'

import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'

import AppStore from '../../../../stores/AppStore'

// Partials
import SideBar from '../Partials/SideBar'
// import Loading from '../../../Partials/Loading'
import ListingModal from '../Partials/ListingModal'


export default class Mls extends Component {

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.initMap()
    }
  }

  initMap() {
    const options = {
      'maximum_price': 9.223372036854776e+18,
      'limit': '75',
      'maximum_lot_square_meters': 8.568721699047544e+17,
      'minimum_bathrooms': 1,
      'maximum_square_meters': 8.568721699047544e+17,
      'location': {
        'longitude': -96.79698789999998,
        'latitude': 32.7766642
      },
      'horizontal_distance': 2830,
      'property_type': 'Residential',
      'vertical_distance': 2830,
      'minimum_square_meters': 0,
      'listing_statuses': ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract'],
      'minimum_lot_square_meters': 0,
      'currency': 'USD',
      'maximum_year_built': 2016,
      'minimum_year_built': 0,
      'points': [{
        latitude: 32.83938955111425,
        longitude: -96.89115626525879
      }, {
        latitude: 32.83938955111425,
        longitude: -96.70284373474121
      }, {
        latitude: 32.71396625328302,
        longitude: -96.70284373474121
      }, {
        latitude: 32.71396625328302,
        longitude: -96.89115626525879
      }, {
        latitude: 32.83938955111425,
        longitude: -96.89115626525879
      }],
      'minimum_bedrooms': 0,
      'minimum_price': 0,
      'open_house': false,
      'property_subtypes': ['RES-Single Family', 'RES-Half Duplex', 'RES-Farm\/Ranch', 'RES-Condo', 'RES-Townhouse']
    }
    const listing_map = {
      options,
      is_loading: true
    }
    AppStore.data.listing_map = listing_map
    AppStore.emitChange()
    const data = this.props.data
    const user = data.user
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options
    })
  }

  showListingModal(listing) {
    const data = this.props.data
    const user = data.user
    AppStore.data.show_listing_modal = true
    AppStore.data.current_listing = listing
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-listing',
      user,
      id: listing.id
    })
  }

  hideModal() {
    delete AppStore.data.show_listing_modal
    delete AppStore.data.current_listing
    AppStore.emitChange()
  }

  handleBoundsChange(center, zoom, bounds) {
    let data = this.props.data
    const user = data.user
    const listing_map = data.listing_map
    if (!listing_map)
      return
    const options = listing_map.options
    options.points = [
      {
        latitude: bounds[0],
        longitude: bounds[1]
      },
      {
        latitude: bounds[0],
        longitude: bounds[3]
      },
      {
        latitude: bounds[2],
        longitude: bounds[3]
      },
      {
        latitude: bounds[2],
        longitude: bounds[1]
      },
      {
        latitude: bounds[0],
        longitude: bounds[1]
      }
    ]
    AppStore.data.listing_map.options = options
    AppStore.data.listing_map.is_loading = true
    AppStore.emitChange()
    data = this.props.data
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options: data.listing_map.options
    })
  }

  render() {
    const data = this.props.data
    const listing_map = data.listing_map
    const main_style = S('absolute h-100p l-183 r-0')
    const center = {
      lat: 32.7767,
      lng: -96.7970
    }
    let map_listing_markers
    let loading
    if (listing_map && listing_map.listings) {
      const listings = listing_map.listings
      map_listing_markers = listings.map(listing => {
        const status_color = listing_util.getStatusColor(listing.status)
        let price_small = Math.floor(listing.price / 1000).toFixed(2).replace(/[.,]00$/, '')
        let letter = 'K'
        if (price_small > 1000) {
          price_small = (price_small / 1000).toFixed(2).replace(/[.,]00$/, '')
          letter = 'M'
        }
        return (
          <div key={ 'map-listing-' + listing.id } onClick={ this.showListingModal.bind(this, listing) } style={ S('pointer mt-10') } lat={ listing.location.latitude } lng={ listing.location.longitude } text={'A'}>
            <div className="map__listing-marker" style={ S('relative bg-fff w-70 h-25') }>
              <div style={ S('absolute l-6 t-8 w-10 h-10 br-100 bg-' + status_color) }></div>
              <div style={ S('absolute r-10 t-6') }>${ price_small }{ letter }</div>
            </div>
          </div>
        )
      })
    }
    if (listing_map && listing_map.is_loading) {
      loading = (
        <div style={ S('z-1000 absolute w-100p t-30') }>
          <div style={ S('bg-3388ff br-20 color-fff w-190 h-29 pt-5 center-block text-center') }>Loading MLS&reg; Listings...</div>
        </div>
      )
    }
    const map_options = {
      mapTypeControl: true
    }
    return (
      <div style={ S('minw-1000') }>
        <main>
          <SideBar data={ data }/>
          <div style={ main_style }>
            { loading }
            <GoogleMap
              defaultCenter={ center }
              defaultZoom={ 13 }
              onBoundsChange={ this.handleBoundsChange.bind(this) }
              options={ map_options }
            >
            { map_listing_markers }
            </GoogleMap>
          </div>
          <ListingModal
            data={ data }
            listing={ data.current_listing }
            hideModal={ this.hideModal }
          />
        </main>
      </div>
    )
  }
}

// PropTypes
Mls.propTypes = {
  data: React.PropTypes.object
}