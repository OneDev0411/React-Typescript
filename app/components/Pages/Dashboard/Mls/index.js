// Dashboard/Mls/index.js
import React, { Component } from 'react'
import S from 'shorti'
import GoogleMap from 'google-map-react'
import { ButtonGroup, Button, Modal } from 'react-bootstrap'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import controller from '../controller'
import SideBar from '../Partials/SideBar'
import MobileNav from '../Partials/MobileNav'
import ShareAlertModal from './Partials/ShareAlertModal'
import ListingViewer from '../Partials/ListingViewer'
import ListingViewerMobile from '../Partials/ListingViewerMobile'
import ListingPanel from './Partials/ListingPanel'
import FilterForm from './Partials/FilterForm'
import ListingMarker from '../Partials/ListingMarker'
// import listing_util from '../../../../utils/listing'
export default class Mls extends Component {
  componentWillMount() {
    const data = this.props.data
    const user = data.user
    if (this.props.params.id) {
      ListingDispatcher.dispatch({
        action: 'get-listing',
        user,
        id: this.props.params.id
      })
    }
    if (!user)
      return
    AppStore.data.user = user
    AppStore.emitChange()
    const listing_map = data.listing_map
    if (!listing_map && typeof window !== 'undefined')
      controller.listing_map.initMap()
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
        listing_types: ['any'],
        status_options: {
          active: ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract']
        },
        minimum_bedrooms: 0,
        minimum_bathrooms: 1,
        pool: 'either'
      }
    }
    AppStore.emitChange()
    // Allow for seamless
    if (!AppStore.data.mounted || AppStore.data.mounted && AppStore.data.mounted.indexOf('recents') === -1) {
      if (!AppStore.data.mounted)
        AppStore.data.mounted = []
      AppStore.data.mounted.push('recents')
      this.getRoomsIndexedDB()
      this.getUserRooms()
    }
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user
    })
    if (this.props.location && this.props.location.query.message && this.props.location.query.message === 'welcome') {
      AppStore.data.show_welcome_modal = true
      AppStore.emitChange()
    }
  }
  componentDidMount() {
    this.checkForMobile()
  }
  componentWillUnmount() {
    controller.listing_map.hideModal()
  }
  checkForMobile() {
    AppDispatcher.dispatch({
      action: 'check-for-mobile'
    })
  }
  getRoomsIndexedDB() {
    const data = this.props.data
    const user = data.user
    AppDispatcher.dispatch({
      action: 'get-rooms-indexeddb',
      user_id: user.id
    })
  }
  getUserRooms() {
    const data = this.props.data
    const user = data.user
    const room_id = this.props.params.room_id
    AppDispatcher.dispatch({
      action: 'get-rooms',
      user,
      room_id
    })
  }
  hideWelcomeModal() {
    delete AppStore.data.show_welcome_modal
    AppStore.emitChange()
  }
  render() {
    const data = this.props.data
    const user = data.user
    const listing_map = data.listing_map
    let main_style = S('absolute h-100p l-70')
    if (data.is_mobile) {
      main_style = {
        ...main_style,
        ...S('l-0 w-100p')
      }
    }
    let map_listing_markers
    let loading
    if (listing_map && listing_map.listings) {
      let listings = listing_map.listings
      // Filter out non location
      listings = listings.filter(listing => {
        return listing.location
      })
      map_listing_markers = listings.map(listing => {
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
    if (listing_map && listing_map.is_loading) {
      let loading_style = S('z-1 center-block relative h-0 w-400 t-20 z-2')
      if (data.is_mobile) {
        loading_style = {
          ...loading_style,
          ...S('fixed t-60')
        }
      }
      loading = (
        <div style={ loading_style }>
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
          hideModal={ controller.listing_map.hideModal }
          hideListingViewer={ controller.listing_viewer.hideListingViewer }
          showModalGallery={ controller.listing_viewer.showModalGallery }
          handleModalGalleryNav={ controller.listing_viewer.handleModalGalleryNav }
          showShareListingModal={ controller.listing_viewer.showShareListingModal }
        />
      )
      // Check for mobile
      if (data.is_mobile) {
        listing_viewer = (
          <ListingViewerMobile
            data={ data }
            listing={ data.current_listing }
            hideModal={ controller.listing_map.hideModal }
            hideListingViewer={ controller.listing_viewer.hideListingViewer }
            showModalGallery={ controller.listing_viewer.showModalGallery }
            handleModalGalleryNav={ controller.listing_viewer.handleModalGalleryNav }
            showShareListingModal={ controller.listing_viewer.showShareListingModal }
          />
        )
      }
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
          onClick={ controller.listing_map.removeDrawing.bind(this) }
          bsStyle="danger"
          className="transition"
          style={ S('absolute z-10 t-80 br-100 w-50 h-50 color-fff pt-1 font-30 text-center r-' + right_value) }
        >
          &times;
        </Button>
      )
    }
    let zoom_right = 'r-20'
    if (data.show_listing_panel)
      zoom_right = 'r-860'
    let zoom_bottom = ' b-25'
    if (data.is_mobile)
      zoom_bottom = ' b-75'
    const zoom_controls = (
      <ButtonGroup className="transition" vertical style={ S('fixed ' + zoom_right + zoom_bottom) }>
        <Button bsSize="large" onClick={ controller.listing_map.handleZoomClick.bind(this, 'in') }><i style={ S('color-929292') } className="fa fa-plus"></i></Button>
        <Button bsSize="large" onClick={ controller.listing_map.handleZoomClick.bind(this, 'out') }><i style={ S('color-929292') } className="fa fa-minus"></i></Button>
      </ButtonGroup>
    )
    let results_actions
    if (listing_map && listing_map.listings) {
      results_actions = (
        <div style={ S('absolute r-10 mt-2') }>
          <span style={ S('bg-a5c0e5 br-3 p-10 color-fff mr-10 relative t-1') }>
            { listing_map.listings.length } Matches
            &nbsp;&nbsp;&nbsp;<span style={ S('pointer') } onClick={ controller.listing_map.handleRemoveListings.bind(this) }>&times;</span>&nbsp;
          </span>
          <Button bsStyle="primary" type="button" onClick={ controller.listing_map.showShareModal.bind(this) }>
            Share ({ listing_map.listings_info ? listing_map.listings_info.total : '' } results)
            &nbsp;&nbsp;<i className="fa fa-share"></i>
          </Button>
        </div>
      )
    }
    let search_input_text
    if (data.listing_map && data.listing_map.search_input_text)
      search_input_text = data.listing_map.search_input_text
    let search_area = (
      <form onSubmit={ controller.listing_map.handleSearchSubmit.bind(this) }>
        <img onClick={ controller.listing_map.handleSearchSubmit.bind(this) } src="/images/dashboard/mls/search.svg" style={ S('pointer w-22 h-22 absolute l-18 t-18') } />
        <input onChange={ controller.listing_map.handleSearchInputChange.bind(this) } value={ search_input_text } ref="search_input" className="form-control" type="text" style={ S('font-18 bg-dfe3e8 w-400 pull-left pl-40') } placeholder="Search location or MLS#" />
      </form>
    )
    if (data.current_listing)
      search_area = ''
    let nav_area = (
      <SideBar data={ data }/>
    )
    if (data.is_mobile && user) {
      nav_area = (
        <MobileNav data={ data }/>
      )
    }
    let toolbar = (
      <nav style={ toolbar_style }>
        <div style={ S('pull-left mr-10') }>
          { search_area }
        </div>
        <div style={ S('pull-left') }>
          <Button onClick={ controller.listing_filter.showFilterForm.bind(this, 'photos') } style={ { ...S('mr-10'), outline: 'none' } }>
            <img src={ `/images/dashboard/mls/filters${data.show_filter_form ? '-active' : ''}.svg` } style={ S('w-20 mr-10') }/>
            <span className={ data.show_filter_form ? 'text-primary' : '' }>Filters</span>
          </Button>
          <Button onClick={ controller.listing_map.toggleDrawable.bind(this) } style={ { ...S('mr-10'), outline: 'none' } }>
            <img src={ `/images/dashboard/mls/draw${data.listing_map && data.listing_map.drawable ? '-active' : ''}.svg` } style={ S('w-20') }/>
          </Button>
          <ButtonGroup style={ S('mr-10') }>
            <Button style={ { outline: 'none' } } onClick={ controller.listing_panel.showPanelView.bind(this, 'list') }>
              <img src={ `/images/dashboard/mls/list${data.listing_panel && data.listing_panel.view === 'list' ? '-active' : ''}.svg` } style={ S('w-20') }/>
            </Button>
            <Button style={ { outline: 'none' } } onClick={ controller.listing_panel.showPanelView.bind(this, 'photos') }>
              <img src={ `/images/dashboard/mls/photos${data.listing_panel && data.listing_panel.view === 'photos' ? '-active' : ''}.svg` } style={ S('w-18') }/>
            </Button>
          </ButtonGroup>
        </div>
        { results_actions }
      </nav>
    )
    if (data.is_mobile) {
      search_area = (
        <form onSubmit={ controller.listing_map.handleSearchSubmit.bind(this) }>
          <img onClick={ controller.listing_map.handleSearchSubmit.bind(this) } src="/images/dashboard/mls/search.svg" style={ S('pointer w-22 h-22 absolute l-13 t-14') } />
          <input onChange={ controller.listing_map.handleSearchInputChange.bind(this) } value={ search_input_text } ref="search_input" className="form-control" type="text" style={ S('font-18 bg-dfe3e8 w-200 pull-left pl-40') } placeholder="Location or MLS#" />
        </form>
      )
      toolbar = (
        <nav style={ S('border-bottom-1-solid-ccc p-5 fixed t-0 w-100p z-10 bg-fff') }>
          <div style={ S('w-150 pull-left') }>
            { search_area }
          </div>
          <div style={ S('pull-right') }>
            <Button onClick={ controller.listing_map.toggleDrawable.bind(this) } style={ { ...S('mr-10'), outline: 'none' } }>
              <img src={ `/images/dashboard/mls/draw${data.listing_map && data.listing_map.drawable ? '-active' : ''}.svg` } style={ S('w-20') }/>
            </Button>
            <Button onClick={ controller.listing_filter.showFilterForm.bind(this, 'photos') } style={ { outline: 'none' } }>
              <img src={ `/images/dashboard/mls/filters${data.show_filter_form ? '-active' : ''}.svg` } style={ S('w-20 mr-10') }/>
              <span className={ data.show_filter_form ? 'text-primary' : '' }>Filters</span>
            </Button>
          </div>
          <div className="clearfix"></div>
        </nav>
      )
    }
    let map_wrapper_style = S('h-' + (window.innerHeight - 62))
    if (data.is_mobile)
      map_wrapper_style = S('fixed w-100p h-100p')
    let main_content = (
      <main>
        { nav_area }
        <div className={ main_class } style={ main_style }>
          { /* this.cacheImages() */ }
          { toolbar }
          { loading }
          <div style={ map_wrapper_style }>
            { remove_drawing_button }
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
          </div>
        </div>
        { listing_viewer }
        <ListingPanel
          data={ data }
          toggleListingPanel={ controller.listing_panel.toggleListingPanel }
          showListingViewer={ controller.listing_viewer.showListingViewer }
          sortListings={ controller.listing_panel.sortListings }
          setActiveListing={ controller.listing_map.setActiveListing }
          removeActiveListing={ controller.listing_map.removeActiveListing }
        />
        <FilterForm
          data={ data }
          handleFilterSwitch={ controller.listing_filter.handleFilterSwitch }
          handleFilterButton={ controller.listing_filter.handleFilterButton }
          resetFilterOptions={ controller.listing_filter.resetFilterOptions }
          setFilterOptions={ controller.listing_filter.setFilterOptions }
          handleOptionChange={ controller.listing_filter.handleOptionChange }
          toggleListingStatusDropdown={ controller.listing_filter.toggleListingStatusDropdown }
          handleFilterStatusOptionSelect={ controller.listing_filter.handleFilterStatusOptionSelect }
          showSoldDatePicker={ controller.listing_filter.showSoldDatePicker }
          handleSetSoldDate={ controller.listing_filter.handleSetSoldDate }
        />
        { zoom_controls }
        <ShareAlertModal
          data={ data }
          shareAlert={ controller.listing_share.shareAlert }
          handleFilterChange={ controller.share_modal.handleFilterChange }
          handleEmailChange={ controller.share_modal.handleEmailChange }
          handlePhoneNumberChange={ controller.share_modal.handlePhoneNumberChange }
          handleAddEmail={ controller.share_modal.handleAddEmail }
          handleAddPhoneNumber={ controller.share_modal.handleAddPhoneNumber }
          handleRemoveShareItem={ controller.share_modal.handleRemoveShareItem }
        />
      </main>
    )
    if (!user)
      main_content = listing_viewer
    return (
      <div style={ S('minw-1000') }>
        <main>
          { main_content }
        </main>
        <Modal dialogClassName={ data.is_mobile ? 'modal-mobile' : '' } show={ data.show_welcome_modal } onHide={ this.hideWelcomeModal }>
          <Modal.Body style={ S('text-center p-50') }>
            <div style={ S('font-42') }>Welcome to Rechat!</div>
            <div style={ S('font-22 color-9b9b9b') }>The Real Estate app that Elevates Your Game</div>
            <div style={ S('mt-20 mb-20 h-156') }>
              <img style={ S('w-100p') } src="/images/signup/value-faces.png" />
            </div>
            <Button bsStyle="primary" style={ S('w-100p') } onClick={ this.hideWelcomeModal }>Start Using Rechat</Button>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}
Mls.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object
}