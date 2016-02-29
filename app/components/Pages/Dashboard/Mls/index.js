// Dashboard/Mls/index.js
import React, { Component } from 'react'
import S from 'shorti'
import GoogleMap from 'google-map-react'
import listing_util from '../../../../utils/listing'
import { ButtonGroup, Button } from 'react-bootstrap'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'

import AppStore from '../../../../stores/AppStore'

// Partials
import SideBar from '../Partials/SideBar'
// import Loading from '../../../Partials/Loading'
import ListingViewer from '../Partials/ListingViewer'

export default class Mls extends Component {

  componentWillMount() {
    const data = this.props.data
    const listing_map = data.listing_map
    if (!listing_map && typeof window !== 'undefined')
      this.initMap()
  }

  componentDidUpdate() {
    const data = this.props.data
    if (!data.current_listing && data.path !== '/dashboard/mls') {
      const history = require('../../../../utils/history')
      history.replaceState(null, '/dashboard/mls')
      delete AppStore.data.current_listing
      AppStore.emitChange()
    }
  }

  componentWillUnmount() {
    this.hideModal()
  }

  initMap() {
    const data = this.props.data
    const user = data.user
    let center = {
      lat: 32.7767,
      lng: -96.7970
    }
    let zoom = 13
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
    if (data.listing_map && data.listing_map.center) {
      center = data.listing_map.center
      zoom = data.listing_map.center
    }
    const listing_map = {
      options,
      is_loading: true,
      center,
      zoom
    }
    AppStore.data.listing_map = listing_map
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options
    })
  }

  showListingViewer(listing) {
    const history = require('../../../../utils/history')
    history.replaceState(null, '/dashboard/mls/' + listing.id)
    const data = this.props.data
    const user = data.user
    AppStore.data.show_listing_viewer = true
    AppStore.data.current_listing = listing
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-listing',
      user,
      id: listing.id
    })
  }

  hideModal() {
    delete AppStore.data.show_listing_viewer
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
    AppStore.data.listing_map.center = center
    AppStore.data.listing_map.zoom = zoom
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

  toggleListingPanel() {
    if (!AppStore.data.show_listing_panel)
      AppStore.data.show_listing_panel = true
    else
      delete AppStore.data.show_listing_panel
    AppStore.emitChange()
  }

  render() {
    const data = this.props.data
    const listing_map = data.listing_map
    const main_style = S('absolute h-100p l-70')
    let map_listing_markers
    let loading
    let listing_panel
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
          <div key={ 'map-listing-' + listing.id } onClick={ this.showListingViewer.bind(this, listing) } style={ S('pointer mt-10') } lat={ listing.location.latitude } lng={ listing.location.longitude } text={'A'}>
            <div className="map__listing-marker" style={ S('relative bg-fff w-70 h-25') }>
              <div style={ S('absolute l-6 t-8 w-10 h-10 br-100 bg-' + status_color) }></div>
              <div style={ S('absolute r-10 t-6') }>${ price_small }{ letter }</div>
            </div>
          </div>
        )
      })
      // Listing panel
      const listing_panel_items = listings.map(listing => {
        const status_color = listing_util.getStatusColor(listing.status)
        let price_small = Math.floor(listing.price / 1000).toFixed(2).replace(/[.,]00$/, '')
        let letter = 'K'
        if (price_small > 1000) {
          price_small = (price_small / 1000).toFixed(2).replace(/[.,]00$/, '')
          letter = 'M'
        }
        let listing_image = <div style={ S('w-500 bg-efefef h-200') }/>
        if (listing.cover_image_url)
          listing_image = <div style={ S('w-500 h-200 bg-url(' + listing.cover_image_url + ') bg-cover bg-center') } />
        return (
          <li key={ 'panel-listing-' + listing.id } onClick={ this.showListingViewer.bind(this, listing) } style={ S('pointer w-400 h-300 bg-fff') } lat={ listing.location.latitude } lng={ listing.location.longitude } text={'A'}>
            <div>
              { listing_image }
            </div>
            <div style={ S('p-10') }>
              <div>
                <div className="pull-left" style={ S('w-10 h-10 br-100 mr-8 bg-' + status_color) }></div>
                <div className="pull-left" style={ S('mt-4n') }>
                  { listing.status }
                </div>
                <div className="clearfix"></div>
              </div>
              <div>{ listing_util.addressTitle(listing.address) }</div>
              <div>${ price_small }{ letter }</div>
            </div>
          </li>
        )
      })
      // Listing panel
      const heading_height = 130
      const listing_panel_wrap_style = S('fixed t-0 r-0 w-0 h-0')
      const listing_panel_style = S('absolute t-0 w-500 h-' + window.innerHeight)
      const listing_scroll_style = {
        ...listing_panel_style,
        top: heading_height + 'px',
        height: window.innerHeight - heading_height,
        overflowY: 'scroll'
      }
      let panel_class = 'listing-panel'
      let button_class = 'listing-panel__button'
      let listing_panel_icon = <i className="fa fa-list"></i>
      if (data.show_listing_panel) {
        panel_class = panel_class + ' active'
        button_class = button_class + ' active'
        listing_panel_icon = (
          <i className="fa fa-times"></i>
        )
      }
      listing_panel = (
        <div style={ listing_panel_wrap_style }>
          <Button onClick={ this.toggleListingPanel.bind(this) } className={ button_class } bsStyle="primary" style={ S('absolute br-100 z-100 pt-8 pb-8 h-40 w-40') }>
            { listing_panel_icon }
          </Button>
          <div style={ listing_panel_style } className={ panel_class }>
            <div style={ S('p-15') }>
              <div className="tempo" style={ S('color-444 fw-100 font-24') }>{ listings.length } Homes Found</div>
              <div style={ S('mb-10') }>Sorting by <a href="#">Most Relevant</a></div>
              <div>
                <ButtonGroup>
                  <Button>List</Button>
                  <Button>Photos</Button>
                  <Button>Map</Button>
                </ButtonGroup>
              </div>
            </div>
            <div style={ listing_scroll_style }>
              <ul style={ S('m-0 p-0') }>
                { listing_panel_items }
              </ul>
            </div>
          </div>
        </div>
      )
    }
    if (listing_map && listing_map.is_loading) {
      loading = (
        <div style={ S('z-1000 absolute w-100p t-30') }>
          <div style={ S('bg-3388ff br-20 color-fff w-190 h-29 pt-5 center-block text-center') }>Loading MLS&reg; Listings...</div>
        </div>
      )
    }
    let listing_viewer
    if (data.show_listing_viewer) {
      listing_viewer = (
        <ListingViewer
          data={ data }
          listing={ data.current_listing }
          hideModal={ this.hideModal }
        />
      )
    }
    let main_class = 'listing-map'
    if (data.show_listing_panel)
      main_class = main_class + ' active'
    const default_center = {
      lat: 32.7767,
      lng: -96.7970
    }
    const default_zoom = 13
    return (
      <div style={ S('minw-1000') }>
        <main>
          <SideBar data={ data }/>
          <div className={ main_class } style={ main_style }>
            { loading }
            <GoogleMap
              defaultCenter={ data.listing_map ? data.listing_map.center : default_center }
              defaultZoom={ data.listing_map ? data.listing_map.zoom : default_zoom }
              onBoundsChange={ this.handleBoundsChange.bind(this) }
              options={ { mapTypeControl: true } }
            >
            { map_listing_markers }
            </GoogleMap>
          </div>
          { listing_viewer }
          { listing_panel }
        </main>
      </div>
    )
  }
}

// PropTypes
Mls.propTypes = {
  data: React.PropTypes.object
}