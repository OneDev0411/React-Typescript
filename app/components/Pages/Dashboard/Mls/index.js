// Dashboard/Mls/index.js
import React, { Component } from 'react'
import S from 'shorti'
import GoogleMap from 'google-map-react'
import listing_util from '../../../../utils/listing'
import helpers from '../../../../utils/helpers'
import { ButtonGroup, Button } from 'react-bootstrap'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

// View controller managers
import AppStore from '../../../../stores/AppStore'
import controller from './controller'

// Partials
import SideBar from '../Partials/SideBar'
import ShareAlertModal from './Partials/ShareAlertModal'
import ListingViewer from '../Partials/ListingViewer'
import ListingPanel from './Partials/ListingPanel'
import FilterForm from './Partials/FilterForm'

export default class Mls extends Component {
  componentWillMount() {
    const data = this.props.data
    const user = data.user
    AppStore.data.user = user
    AppStore.emitChange()
    const listing_map = data.listing_map
    if (!listing_map && typeof window !== 'undefined')
      controller.initMap()
    delete AppStore.data.current_listing
    delete AppStore.data.share_list
    delete AppStore.data.listing_map.saving_alert
    // Set switch states
    if (!AppStore.data.listing_map.filter_options) {
      AppStore.data.listing_map.filter_options = {
        sold: false,
        active: true,
        other: false,
        open_houses: false,
        listing_types: ['house']
      }
    }
    AppStore.emitChange()
    AppDispatcher.dispatch({
      action: 'get-rooms',
      user
    })
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user
    })
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
    controller.hideModal()
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
        let active_class = ''
        if (listing.id === data.listing_map.active_listing)
          active_class = ' active'
        let popup_class = 'hidden'
        if (listing.id === data.listing_map.listing_popup)
          popup_class = ''
        const square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(listing.compact_property.square_meters)))
        const listing_popup = (
          <div className={ popup_class } style={ S('absolute w-240 t-110n l-35n z-1000 bg-fff border-1-solid-929292') }>
            <div style={ S('pull-left mr-10') }>
              <div style={ S(`w-80 h-80 bg-url(${listing.cover_image_url}) bg-cover bg-center`) }/>
            </div>
            <div style={ S('pull-left pt-10') }>
              <div className="listing-map__marker__popup__title" style={ S('font-12 w-140') }>{ listing_util.addressTitle(listing.address) }</div>
              <div style={ S('font-11') }>{ listing.compact_property.bedroom_count } Beds,&nbsp;
              { listing.compact_property.bathroom_count } Baths,&nbsp;
              { square_feet } Sqft</div>
              <div style={ S('font-11 color-' + listing_util.getStatusColor(listing.status)) }>{ listing.status }</div>
            </div>
          </div>
        )
        let listing_marker = (
          <div className={ 'map__listing-marker' + active_class } style={ S('relative w-70 h-25 br-3') }>
            <div style={ S('absolute l-6 t-8 w-10 h-10 br-100 bg-' + status_color) }></div>
            <div style={ S('absolute r-10 t-6') }>${ price_small }{ letter }</div>
          </div>
        )
        if (listing.open_houses) {
          // Open house marker
          const open_style = {
            ...S('bg-35b863 w-15 h-100p color-fff font-5 pt-3'),
            lineHeight: '5px'
          }
          listing_marker = (
            <div className={ 'map__listing-marker' + active_class } style={ S('relative w-80 h-25 br-3') }>
              <div style={ open_style }>O<br />P<br />E<br />N</div>
              <div style={ S('absolute l-20 t-8 w-10 h-10 br-100 bg-' + status_color) }></div>
              <div style={ S('absolute r-10 t-6') }>${ price_small }{ letter }</div>
            </div>
          )
        }
        return (
          <div onMouseOver={ controller.showListingPopup.bind(this, listing) } onMouseOut={ controller.hideListingPopup.bind(this) } key={ 'map-listing-' + listing.id } onClick={ controller.showListingViewer.bind(this, listing) } style={ S('pointer mt-10') } lat={ listing.location.latitude } lng={ listing.location.longitude } text={'A'}>
            { listing_popup }
            { listing_marker }
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
          hideModal={ controller.hideModal }
          hideListingViewer={ controller.hideListingViewer }
          showModalGallery={ controller.showModalGallery }
          handleModalGalleryNav={ controller.handleModalGalleryNav }
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
    // TODO move to ENV_VAR
    const bootstrap_url_keys = {
      key: 'AIzaSyDagxNRLRIOsF8wxmuh1J3ysqnwdDB93-4',
      libraries: ['drawing'].join(',')
    }
    let map_id
    if (listing_map && listing_map.map_id)
      map_id = listing_map.map_id
    let remove_drawing_button
    if (window.poly) {
      let right_value = 80
      if (data.listing_panel)
        right_value = 910
      remove_drawing_button = (
        <Button
          onClick={ controller.removeDrawing.bind(this) }
          bsStyle="danger"
          className="transition"
          style={ S('absolute z-1000 t-80 br-100 w-50 h-50 color-fff pt-1 font-30 text-center r-' + right_value) }
        >
          &times;
        </Button>
      )
    }
    let zoom_right = 'r-20'
    if (data.show_listing_panel)
      zoom_right = 'r-860'
    const zoom_controls = (
      <ButtonGroup className="transition" vertical style={ S('absolute b-25 ' + zoom_right) }>
        <Button bsSize="large" onClick={ controller.handleZoomClick.bind(this, 'in') }><i style={ S('color-929292') } className="fa fa-plus"></i></Button>
        <Button bsSize="large" onClick={ controller.handleZoomClick.bind(this, 'out') }><i style={ S('color-929292') } className="fa fa-minus"></i></Button>
      </ButtonGroup>
    )
    let results_actions
    if (listing_map && listing_map.listings) {
      results_actions = (
        <div style={ S('absolute r-10 mt-2') }>
          <span style={ S('bg-a5c0e5 br-3 p-10 color-fff mr-10 relative t-1') }>
            { listing_map.listings.length } Matches
            &nbsp;&nbsp;&nbsp;<span style={ S('pointer') } onClick={ controller.handleRemoveListings.bind(this) }>&times;</span>&nbsp;
          </span>
          <Button bsStyle="primary" type="button" onClick={ controller.showShareModal.bind(this) }>
            Share ({ listing_map.listings.length })
            &nbsp;&nbsp;<i className="fa fa-share"></i>
          </Button>
        </div>
      )
    }
    return (
      <div style={ S('minw-1000') }>
        <main>
          <SideBar data={ data }/>
          <div className={ main_class } style={ main_style }>
            <nav style={ toolbar_style }>
              <div style={ S('pull-left mr-10') }>
                <form onSubmit={ controller.handleSearchSubmit.bind(this) }>
                  <img src="/images/dashboard/mls/search.svg" style={ S('w-22 h-22 absolute l-18 t-18') } />
                  <input ref="search_input" className="form-control" type="text" style={ S('font-18 bg-dfe3e8 w-400 pull-left pl-40') } placeholder="Search location or MLS#" />
                </form>
              </div>
              <div style={ S('pull-left') }>
                <Button onClick={ controller.showFilterForm.bind(this, 'photos') } style={ { ...S('mr-10'), outline: 'none' } }>
                  <img src={ `/images/dashboard/mls/filters${data.show_filter_form ? '-active' : ''}.svg` } style={ S('w-20 mr-10') }/>
                  <span className={ data.show_filter_form ? 'text-primary' : '' }>Filters</span>
                </Button>
                <Button onClick={ controller.toggleDrawable.bind(this) } style={ { ...S('mr-10'), outline: 'none' } }>
                  <img src={ `/images/dashboard/mls/draw${data.listing_map && data.listing_map.drawable ? '-active' : ''}.svg` } style={ S('w-20') }/>
                </Button>
                <ButtonGroup style={ S('mr-10') }>
                  <Button style={ { outline: 'none' } } onClick={ controller.showPanelView.bind(this, 'list') }>
                    <img src={ `/images/dashboard/mls/list${data.listing_panel && data.listing_panel.view === 'list' ? '-active' : ''}.svg` } style={ S('w-20') }/>
                  </Button>
                  <Button style={ { outline: 'none' } } onClick={ controller.showPanelView.bind(this, 'photos') }>
                    <img src={ `/images/dashboard/mls/photos${data.listing_panel && data.listing_panel.view === 'photos' ? '-active' : ''}.svg` } style={ S('w-18') }/>
                  </Button>
                </ButtonGroup>
              </div>
              { results_actions }
            </nav>
            { loading }
            <div style={ S('h-' + (window.innerHeight - 62)) }>
              { remove_drawing_button }
              <GoogleMap
                key={ 'map-' + map_id }
                bootstrapURLKeys={ bootstrap_url_keys }
                center={ listing_map ? listing_map.center : default_center }
                zoom={ listing_map ? listing_map.zoom : default_zoom }
                onBoundsChange={ controller.handleBoundsChange.bind(this) }
                options={ controller.createMapOptions.bind(this) }
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={ controller.handleGoogleMapApi.bind(this) }
              >
              { map_listing_markers }
              </GoogleMap>
            </div>
          </div>
          { listing_viewer }
          <ListingPanel
            data={ data }
            toggleListingPanel={ controller.toggleListingPanel }
            showListingViewer={ controller.showListingViewer }
            sortListings={ controller.sortListings }
            setActiveListing={ controller.setActiveListing }
            removeActiveListing={ controller.removeActiveListing }
          />
          <FilterForm
            data={ data }
            handleFilterSwitch={ controller.handleFilterSwitch }
            handleFilterButton={ controller.handleFilterButton }
            resetFilterOptions={ controller.resetFilterOptions }
            setFilterOptions={ controller.setFilterOptions }
            handleOptionChange={ controller.handleOptionChange }
          />
          { zoom_controls }
          <ShareAlertModal
            data={ data }
            shareAlert={ controller.shareAlert }
            handleShareFilter={ controller.handleShareFilter }
            handleEmailChange={ controller.handleEmailChange }
            handlePhoneNumberChange={ controller.handlePhoneNumberChange }
            handleAddEmail={ controller.handleAddEmail }
            handleAddPhoneNumber={ controller.handleAddPhoneNumber }
            handleRemoveShareItem={ controller.handleRemoveShareItem }
          />
        </main>
      </div>
    )
  }
}

Mls.propTypes = {
  data: React.PropTypes.object
}