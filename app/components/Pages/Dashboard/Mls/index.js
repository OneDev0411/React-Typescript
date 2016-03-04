// Dashboard/Mls/index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import GoogleMap from 'google-map-react'
import listing_util from '../../../../utils/listing'
import { ButtonGroup, Button } from 'react-bootstrap'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'

import AppStore from '../../../../stores/AppStore'

// Partials
import SideBar from '../Partials/SideBar'
// import Loading from '../../../Partials/Loading'
import ListingViewer from '../Partials/ListingViewer'
import ListingPanel from './Partials/ListingPanel'
import FilterForm from './Partials/FilterForm'
export default class Mls extends Component {

  componentWillMount() {
    const data = this.props.data
    const listing_map = data.listing_map
    if (!listing_map && typeof window !== 'undefined')
      this.initMap()
    delete AppStore.data.current_listing
    AppStore.emitChange()
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
      default_options: options,
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
    if (!AppStore.data.show_listing_panel) {
      AppStore.data.show_listing_panel = true
      AppStore.data.listing_panel = {
        view: 'photos'
      }
    } else {
      delete AppStore.data.show_listing_panel
      delete AppStore.data.listing_panel
    }
    AppStore.emitChange()
  }

  showPanelView(view) {
    if (AppStore.data.show_listing_panel && AppStore.data.listing_panel && AppStore.data.listing_panel.view === view) {
      delete AppStore.data.listing_panel
      delete AppStore.data.show_listing_panel
      AppStore.emitChange()
      return
    }
    AppStore.data.listing_panel = {
      view
    }
    if (!AppStore.data.show_listing_panel)
      AppStore.data.show_listing_panel = true
    delete AppStore.data.show_filter_form
    AppStore.emitChange()
  }

  sortListings(sort_by) {
    const data = this.props.data
    const listings = data.listing_map.listings
    let sorting_direction = 1
    if (AppStore.data.listing_map.sorting_direction)
      sorting_direction = AppStore.data.listing_map.sorting_direction * -1
    const listings_sorted = _.sortBy(listings, listing => {
      if (sort_by === 'area')
        return listing.address.postal_code * sorting_direction
      if (sort_by === 'price')
        return listing.price * sorting_direction
      if (sort_by === 'bedroom_count')
        return listing.compact_property.bedroom_count * sorting_direction
      if (sort_by === 'bathroom_count')
        return listing.compact_property.bathroom_count * sorting_direction
      if (sort_by === 'square_meters')
        return listing.compact_property.square_meters * sorting_direction
      if (sort_by === 'year_built')
        return listing.compact_property.year_built * sorting_direction
    })
    AppStore.data.listing_map.listings = listings_sorted
    AppStore.data.listing_map.sorting_direction = sorting_direction
    AppStore.data.listing_map.sorting_by = sort_by
    AppStore.emitChange()
  }

  showFilterForm() {
    delete AppStore.data.listing_panel
    delete AppStore.data.show_listing_panel
    if (AppStore.data.show_filter_form)
      delete AppStore.data.show_filter_form
    else
      AppStore.data.show_filter_form = true
    AppStore.emitChange()
  }

  handleFilterSwitch(key) {
    if (!AppStore.data.listing_map.filtering_options)
      AppStore.data.listing_map.filtering_options = {}
    if (!AppStore.data.listing_map.filtering_options[key])
      AppStore.data.listing_map.filtering_options[key] = true
    else
      delete AppStore.data.listing_map.filtering_options[key]
    AppStore.emitChange()
  }

  handleFilterButton(payload) {
    const key = payload.key
    const value = payload.value
    const filtering_options = AppStore.data.listing_map.filtering_options
    if (!filtering_options)
      AppStore.data.listing_map.filtering_options = {}
    if (key === 'listing_types') {
      let listing_types = []
      if (filtering_options && filtering_options.listing_types)
        listing_types = filtering_options.listing_types
      // If has already, remove
      if (listing_types.indexOf(value) !== -1)
        listing_types = _.pull(listing_types, value)
      else
        listing_types.push(value)
      AppStore.data.listing_map.filtering_options.listing_types = listing_types
    }
    if (key === 'bedroom_count' || key === 'bathroom_count')
      AppStore.data.listing_map.filtering_options[key] = Number(value)
    if (key === 'pool')
      AppStore.data.listing_map.filtering_options[key] = Boolean(value)
    AppStore.emitChange()
  }

  resetFilterOptions() {
    const data = this.props.data
    const listing_map = data.listing_map
    AppStore.data.listing_map.options = listing_map.default_options
    AppStore.emitChange()
  }

  setFilterOptions(e) {
    e.preventDefault()
    const data = this.props.data
    const user = data.user
    const listing_map = data.listing_map
    const options = listing_map.options
    const minimum_price = Number(this.refs.minimum_price.refs.input.value.trim())
    if (minimum_price)
      options.minimum_price = minimum_price
    const maximum_price = Number(this.refs.maximum_price.refs.input.value.trim())
    if (maximum_price)
      options.maximum_price = maximum_price
    AppStore.data.listing_map.is_loading = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options
    })
  }

  render() {
    const data = this.props.data
    const listing_map = data.listing_map
    const main_style = S('absolute h-100p l-70')
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
          <div key={ 'map-listing-' + listing.id } onClick={ this.showListingViewer.bind(this, listing) } style={ S('pointer mt-10') } lat={ listing.location.latitude } lng={ listing.location.longitude } text={'A'}>
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
        <div style={ S('z-1 center-block relative h-0 w-400 t-20') }>
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
    const toolbar_style = {
      ...S('h-62 p-10'),
      borderBottom: '1px solid #dcd9d9'
    }
    return (
      <div style={ S('minw-1000') }>
        <main>
          <SideBar data={ data }/>
          <div className={ main_class } style={ main_style }>
            <nav style={ toolbar_style }>
              <div style={ S('pull-left mr-10') }>
                <input className="form-control" type="text" style={ S('bg-dfe3e8 w-400 pull-left') } placeholder="Search location or MLS#" />
              </div>
              <div style={ S('pull-left') }>
                <Button onClick={ this.showFilterForm.bind(this, 'photos') } style={ { ...S('mr-10'), outline: 'none' } }>
                  <img src={ `/images/dashboard/mls/filters${data.show_filter_form ? '-active' : ''}.svg` } style={ S('w-20 mr-10') }/>
                  <span className={ data.show_filter_form ? 'text-primary' : '' }>Filters</span>
                </Button>
                <Button style={ { ...S('mr-10'), outline: 'none' } }>
                  <img src="/images/dashboard/mls/draw.svg" style={ S('w-20 mr-10') }/>
                  Draw
                </Button>
                <ButtonGroup style={ S('mr-10') }>
                  <Button style={ { outline: 'none' } } onClick={ this.showPanelView.bind(this, 'list') }>
                    <img src={ `/images/dashboard/mls/list${data.listing_panel && data.listing_panel.view === 'list' ? '-active' : ''}.svg` } style={ S('w-20 mr-10') }/>
                    <span className={ data.listing_panel && data.listing_panel.view === 'list' ? 'text-primary' : 'default'}>List</span>
                  </Button>
                  <Button style={ { outline: 'none' } } onClick={ this.showPanelView.bind(this, 'photos') }>
                    <img src={ `/images/dashboard/mls/photos${data.listing_panel && data.listing_panel.view === 'photos' ? '-active' : ''}.svg` } style={ S('w-18 mr-10') }/>
                    <span className={ data.listing_panel && data.listing_panel.view === 'photos' ? 'text-primary' : 'default'}>Photos</span>
                  </Button>
                </ButtonGroup>
              </div>
            </nav>
            { loading }
            <div style={ S('h-' + (window.innerHeight - 62)) }>
              <GoogleMap
                defaultCenter={ data.listing_map ? data.listing_map.center : default_center }
                defaultZoom={ data.listing_map ? data.listing_map.zoom : default_zoom }
                onBoundsChange={ this.handleBoundsChange.bind(this) }
                options={ { mapTypeControl: true } }
              >
              { map_listing_markers }
              </GoogleMap>
            </div>
          </div>
          { listing_viewer }
          <ListingPanel
            data={ data }
            toggleListingPanel={ this.toggleListingPanel }
            showListingViewer={ this.showListingViewer }
            sortListings={ this.sortListings }
          />
          <FilterForm
            data={ data }
            handleFilterSwitch={ this.handleFilterSwitch }
            handleFilterButton={ this.handleFilterButton }
            resetFilterOptions={ this.resetFilterOptions }
            setFilterOptions={ this.setFilterOptions }
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