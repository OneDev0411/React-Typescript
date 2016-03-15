// Dashboard/Mls/index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import GoogleMap from 'google-map-react'
import listing_util from '../../../../utils/listing'
import { ButtonGroup, Button, Modal, Input, Alert } from 'react-bootstrap'

// View controller managers
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import controller from './controller'

// Partials
import SideBar from '../Partials/SideBar'
// import Loading from '../../../Partials/Loading'
import ListingViewer from '../Partials/ListingViewer'
import ListingPanel from './Partials/ListingPanel'
import FilterForm from './Partials/FilterForm'
// import AddContactsModule from '../Modules/AddContacts'
import ProfileImage from '../Partials/ProfileImage'

export default class Mls extends Component {
  componentWillMount() {
    const data = this.props.data
    const listing_map = data.listing_map
    if (!listing_map && typeof window !== 'undefined')
      controller.initMap()
    delete AppStore.data.current_listing
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

  getValertsInArea(points) {
    const data = AppStore.data
    const user = data.user
    const options = AppStore.data.listing_map.options
    options.points = points
    AppStore.data.listing_map.google_options.draggable = true
    AppStore.data.listing_map.is_loading = true
    ListingDispatcher.dispatch({
      action: 'get-valerts',
      user,
      options
    })
  }

  makePolygon() {
    const google = window.google
    const map = window.map
    const path = window.poly.getPath()
    window.poly.setMap(null)
    window.poly = new google.maps.Polygon({
      clickable: false,
      map,
      path,
      strokeColor: '#3388ff',
      strokeWeight: 10
    })
  }

  getPolygonBounds(google, polygon) {
    const polygon_bounds = polygon.getPath()
    const coordinates = []
    let lat_lng
    for (let i = 0; i < polygon_bounds.length; i++) {
      lat_lng = {
        latitude: polygon_bounds.getAt(i).lat(),
        longitude: polygon_bounds.getAt(i).lng()
      }
      coordinates.push(lat_lng)
    }
    const points = [
      ...coordinates,
      coordinates[0]
    ]
    return points
  }

  removeDrawing() {
    if (!window.poly)
      return
    window.poly.setMap(null)
    delete AppStore.data.listing_map.drawable
    AppStore.emitChange()
    let center = window.map.getCenter()
    center = {
      lat: center.lat(),
      lng: center.lng()
    }
    const zoom = window.map.getZoom()
    let bounds = window.map.getBounds()
    bounds = [
      bounds.getNorthEast().lat(),
      bounds.getSouthWest().lng(),
      bounds.getSouthWest().lat(),
      bounds.getNorthEast().lng()
    ]
    delete window.poly
    controller.handleBoundsChange(center, zoom, bounds)
  }

  render() {
    const data = this.props.data
    const contacts = data.contacts
    const rooms = data.rooms
    const share_list = data.share_list
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
          hideModal={ controller.hideModal }
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
          onClick={ this.removeDrawing.bind(this) }
          bsStyle="danger"
          className="transition"
          style={ S('absolute z-1000 t-80 br-100 w-50 h-50 color-fff pt-1 font-30 text-center r-' + right_value) }
        >
          &times;
        </Button>
      )
    }
    const zoom_controls = (
      <ButtonGroup vertical style={ S('absolute b-25 r-20') }>
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
    let message
    if (data.error) {
      message = (
        <Alert bsStyle="danger" closeButton className="text-left">{ data.error.message }</Alert>
      )
    }
    const contacts_rooms_scroll = {
      overflowY: 'scroll',
      ...S('w-100p maxh-200 relative border-1-solid-ccc br-3')
    }
    let share_stats
    if (share_list && share_list.rooms.length || share_list && share_list.contacts.length) {
      let space
      if (share_list.rooms.length && share_list.contacts.length) {
        space = (
          <span>&nbsp;and&nbsp;</span>
        )
      }
      share_stats = (
        <div style={ S('font-14 pull-right mt-10 color-006aff') }>
          { share_list.rooms.length ? share_list.rooms.length + ' rooms' : '' }
          { space }
          { share_list.contacts.length ? share_list.contacts.length + ' contacts' : '' }
          &nbsp;&nbsp;selected
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
            showListingViewer={ this.showListingViewer }
            sortListings={ controller.sortListings }
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
          <Modal show={ listing_map && listing_map.show_share_modal } onHide={ controller.hideModal }>
            <Modal.Header>
              <Modal.Title>Share Alert</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Input style={ S('mb-20') } ref="alert_title" type="text" placeholder="Name this alert" />
              <div style={ S('mb-20') }>
                <div style={ S('pull-left mr-10') }>
                  <img style={ S('w-100 h-100 br-3') } src="/images/dashboard/mls/map-tile.jpg" />
                </div>
                <div style={ S('pull-left w-50p') }>
                  <div style={ S('color-929292 font-18') }>Alert</div>
                  <div style={ S('color-000 font-20') }>{ listing_map && listing_map.listings ? listing_map.listings.length : '' } Results</div>
                  <div style={ S('color-929292 font-14') }>We’ll keep you updated with any new listings and price drops for the selected area</div>
                </div>
                <div className="clearfix"></div>
              </div>
              <div style={ S('mb-10') }>
                <div style={ S('font-20 pull-left') }>
                  Choose rooms or contacts
                </div>
                { share_stats }
                <div className="clearfix"></div>
              </div>
              <div style={ contacts_rooms_scroll }>
                <div style={ S('w-100p') }>
                  <div style={ S('font-16 bg-efefef p-5') }>Rooms</div>
                  {
                    rooms.map(room => {
                      // List users
                      const users = room.users
                      const first_names = _.pluck(users, 'first_name')
                      let first_name_list = ''
                      first_names.forEach((first_name, _i) => {
                        first_name_list += first_name
                        if (_i < first_names.length - 1) first_name_list += ', '
                      })
                      let author
                      let profile_image_div
                      if (room.latest_message.author) {
                        author = room.latest_message.author
                        profile_image_div = (
                          <ProfileImage data={ data } user={ author }/>
                        )
                      }
                      if (!room.latest_message.author) {
                        profile_image_div = (
                          <div style={ S('absolute w-35') }>
                            <img className="center-block" src="/images/dashboard/rebot@2x.png" style={ S('w-30') } />
                          </div>
                        )
                      }
                      let selected
                      if (share_list && share_list.rooms && share_list.rooms.includes(room.id)) {
                        selected = (
                          <div style={ S('absolute t-18 r-10') }>
                            <div style={ S('br-100 bg-006aff w-25 h-25 pt-3 text-center') }><i style={ S('color-fff') } className="fa fa-check"></i></div>
                          </div>
                        )
                      }
                      return (
                        <div onClick={ controller.addToShareList.bind(this, 'rooms', room.id) } style={ S('relative h-60 pointer p-5') } className="share-item">
                          { profile_image_div }
                          <div className="pull-left" style={ S('ml-50 w-90p') }>
                            <div className="pull-left">
                              <b>{ room.title.substring(0, 50) }{ room.title.length > 50 ? '...' : '' }</b>
                            </div>
                            <div className="clearfix"></div>
                            <div style={ S('color-aaaaaa w-74p') }>{ first_name_list }</div>
                          </div>
                          { selected }
                          <div className="clearfix"></div>
                        </div>
                      )
                    })
                  }
                  <div className="clearfix"></div>
                  <div style={ S('font-16 bg-efefef p-5') }>Contacts</div>
                  {
                    contacts.map(contact => {
                      let selected
                      if (share_list && share_list.contacts && share_list.contacts.includes(contact.id)) {
                        selected = (
                          <div style={ S('absolute t-18 r-10') }>
                            <div style={ S('br-100 bg-006aff w-25 h-25 pt-3 text-center') }><i style={ S('color-fff') } className="fa fa-check"></i></div>
                          </div>
                        )
                      }
                      return (
                        <div onClick={ controller.addToShareList.bind(this, 'contacts', contact.id) } style={ S('h-60 relative p-3 pl-0 pr-10 mr-10 w-100p pointer p-10') } className="share-item" key={ 'added-contact-' + contact.id }>
                          <div style={ S('l-10 t-10 absolute') }>
                            <ProfileImage data={ data } top={11} size={40} user={ contact }/>
                          </div>
                          <div style={ S('ml-65') }>
                            <div>{ contact.first_name } { contact.last_name }</div>
                            <div>{ contact.email }</div>
                          </div>
                          { selected }
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              { message }
              <Button onClick={ controller.hideModal } bsStyle="link">Cancel</Button>
              <Button bsStyle="primary" onClick={ controller.shareAlert.bind(this) }>Share Alert&nbsp;&nbsp;<i className="fa fa-share"></i></Button>
            </Modal.Footer>
          </Modal>
        </main>
      </div>
    )
  }
}

// PropTypes
Mls.propTypes = {
  data: React.PropTypes.object
}