// Dashboard/Mls/index.js
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import S from 'shorti'
import _ from 'lodash'
import { FormControl, ButtonGroup, Button, Modal, OverlayTrigger, Popover } from 'react-bootstrap'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import controller from '../controller'
import SideBar from '../Partials/SideBar'
import MobileNav from '../Partials/MobileNav'
import ShareAlertModal from './Partials/ShareAlertModal'
import ShareTypeModal from './Partials/ShareTypeModal'
import ListingViewer from '../Partials/ListingViewer'
import ListingViewerMobile from '../Partials/ListingViewerMobile'
import ListingPanel from './Partials/ListingPanel'
import FilterForm from './Partials/FilterForm'
import MlsMap from './Partials/MlsMap'
import AlertList from './Partials/AlertList'
import AlertViewer from './Partials/AlertViewer'
import listing_util from '../../../../utils/listing'
import validator from 'validator'
import { randomString } from '../../../../utils/helpers'
import CheckEmailModal from '../Partials/CheckEmailModal'
import SvgFilters from '../Partials/Svgs/Filters'
import SvgDraw from '../Partials/Svgs/Draw'
import SvgGlobe from '../Partials/Svgs/Globe'
import SvgList from '../Partials/Svgs/List'
import SvgPhotos from '../Partials/Svgs/Photos'
import Brand from '../../../../controllers/Brand'
import MobileSplashViewer from '../../../Partials/MobileSplashViewer'

export default class Mls extends Component {
  componentWillMount() {
    const data = this.props.data
    const user = data.user
    if (this.props.params && this.props.params.id) {
      ListingDispatcher.dispatch({
        action: 'get-listing',
        user,
        id: this.props.params.id
      })
    }
    // Show map first
    AppStore.data.show_search_map = true
    AppStore.data.user = user
    AppStore.emitChange()
    const listing_map = data.listing_map
    if (!listing_map && typeof window !== 'undefined')
      controller.listing_map.initMap()
    delete AppStore.data.current_listing
    delete AppStore.data.share_list
    if (listing_map && listing_map.saving_alert)
      delete AppStore.data.listing_map.saving_alert
    // Get only map (above) for non-logged in user
    if (!user) {
      if (listing_map) {
        ListingDispatcher.dispatch({
          action: 'get-valerts',
          user,
          options: listing_map.options
        })
      }
      return
    }
    // Allow for seamless
    if (!AppStore.data.mounted || AppStore.data.mounted && AppStore.data.mounted.indexOf('recents') === -1) {
      if (!AppStore.data.mounted)
        AppStore.data.mounted = []
      AppStore.data.mounted.push('recents')
      if (typeof window !== 'undefined')
        this.getRoomsIndexedDB()
      this.getUserRooms()
    }
    if (this.props.location && this.props.location.query.message && this.props.location.query.message === 'welcome') {
      AppStore.data.show_welcome_modal = true
      AppStore.emitChange()
    }
    // Get alerts
    if (!data.alerts) {
      ListingDispatcher.dispatch({
        action: 'get-alerts',
        user
      })
    }
    // Get favorites
    if (!data.favorite_listings) {
      ListingDispatcher.dispatch({
        action: 'get-favorites',
        user
      })
    }
    // TODO REMOVE DEPRECATED //
    // Get actives
    // if (!data.active_listings) {
    //   ListingDispatcher.dispatch({
    //     action: 'get-actives',
    //     user
    //   })
    // }
  }
  componentDidMount() {
    this.resetViews()
    this.routeURL()
    this.checkForMobile()
    Brand.checkBranding()
    this.checkQuery()
    this.showHalfPanel()
  }
  componentDidUpdate() {
    const data = this.props.data
    // Init google search
    if (window.google && window.google.maps.places && !data.google_search_is_loaded && document.getElementById('google_search')) {
      controller.search_input_map.initGoogleSearch()
      AppStore.data.google_search_is_loaded = true
      AppStore.emitChange()
    }
    const routeParams = this.props.routeParams
    let alert_id
    if (routeParams)
      alert_id = routeParams.alert_id
    const path = data.path
    if (data.show_listing_viewer && path === '/dashboard/mls') {
      delete AppStore.data.show_listing_viewer
      delete AppStore.data.current_listing
      AppStore.emitChange()
    }
    if (!alert_id || !data.alerts || data.current_alert)
      return
    const alert = _.find(data.alerts, { id: alert_id })
    if (alert && window.map) {
      AppStore.data.current_alert = alert
      AppStore.emitChange()
      controller.alert_map.showAlertOnMap(alert)
    }
  }
  componentWillUnmount() {
    controller.listing_map.hideModal()
  }
  showHalfPanel() {
    const data = this.props.data
    AppStore.data.listing_panel = {
      view: 'photos',
      size: 'half'
    }
    AppStore.data.show_listing_panel = true
    AppStore.emitChange()
  }
  initGoogleSearch() {
    if (window.google) {
      setTimeout(() => {
        controller.search_input_map.initGoogleSearch()
      }, 500)
    }
  }
  routeURL() {
    const data = this.props.data
    const path = data.path
    if (path === '/dashboard/mls')
      AppStore.data.show_search_map = true
    if (path === '/dashboard/mls/actives')
      AppStore.data.show_actives_map = true
    if (path.indexOf('/dashboard/mls/alerts') !== -1)
      AppStore.data.show_alerts_map = true
    AppStore.emitChange()
  }
  checkForMobile() {
    AppDispatcher.dispatch({
      action: 'check-for-mobile'
    })
  }
  checkQuery() {
    const data = this.props.data
    const q = data.location.query.q
    if (q)
      this.refs.search_input.value = q
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
    if (!this.props.params)
      return
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
  changeURL(url) {
    browserHistory.push(url)
  }
  resetViews() {
    delete AppStore.data.show_search_map
    delete AppStore.data.show_alerts_map
    delete AppStore.data.show_actives_map
    AppStore.emitChange()
  }
  handleTabClick(type) {
    if (window.poly) {
      window.poly.setMap(null)
      delete window.poly
    }
    this.resetViews()
    switch (type) {
      case 'search':
        this.initGoogleSearch()
        AppStore.data.show_search_map = true
        delete AppStore.data.listing_map.auto_move
        controller.listing_filter.setFilterOptions.bind(this)
        if (window.poly_search) {
          window.poly = window.poly_search
          const google = window.google
          const map = window.map
          const path = window.poly.getPath()

          window.poly = new google.maps.Polygon({
            clickable: false,
            map,
            path,
            strokeColor: '#' + Brand.color('primary', '3388ff'),
            strokeWeight: 10
          })
        }
        this.changeURL('/dashboard/mls')
        this.showHalfPanel()
        break
      case 'alerts':
        AppStore.data.show_alerts_map = true
        delete AppStore.data.listing_map.auto_move
        delete AppStore.data.show_filter_form
        delete AppStore.data.show_listing_panel
        delete AppStore.data.listing_panel
        AppStore.data.show_alerts_map = true
        if (window.poly_alerts) {
          window.poly = window.poly_alerts
          const google = window.google
          const map = window.map
          const path = window.poly.getPath()
          window.poly = new google.maps.Polygon({
            clickable: false,
            map,
            path,
            strokeColor: '#3388ff',
            strokeWeight: 10
          })
        }
        this.changeURL('/dashboard/mls/alerts')
        break
      case 'actives':
        AppStore.data.show_actives_map = true
        this.changeURL('/dashboard/mls/actives')
        break
      default:
        return
    }
    AppStore.emitChange()
  }
  handleClearSearchInputClick() {
    const data = this.props.data
    delete AppStore.data.listing_map.search_input_text
    delete AppStore.data.listing_map.auto_move
    delete AppStore.data.listing_map.has_search_input
    delete AppStore.data.listing_map.no_listings_found

    if (AppStore.data.search_input)
      delete AppStore.data.search_input.listings

    if (AppStore.data.listing_map.options)
      AppStore.data.listing_map.options.postal_codes = null

    delete AppStore.data.listing_map.has_location_search
    delete AppStore.data.listing_map.location_search

    AppStore.emitChange()

    let bounds = window.map.getBounds().toJSON()
    bounds = [
      bounds.south,
      bounds.west,
      bounds.north,
      bounds.east
    ]
    controller.listing_map.handleBoundsChange(data.listing_map.center, data.listing_map.zoom, bounds)
  }
  handleCloseSignupForm() {
    delete AppStore.data.show_signup_form
    AppStore.emitChange()
  }
  handleEmailSubmit(e) {
    // If clicked
    setTimeout(() => {
      this.refs.email.refs.input.focus()
    }, 100)
    e.preventDefault()
    delete AppStore.data.errors
    AppStore.emitChange()
    const data = this.props.data
    const email = this.emailInput.value
    // If no email or double submit
    if (!email || data.submitting)
      return
    const random_password = randomString(9)
    if (!email.trim())
      return
    if (!validator.isEmail(email)) {
      AppStore.data.errors = {
        type: 'email-invalid'
      }
      AppStore.emitChange()
      setTimeout(() => {
        delete AppStore.data.errors
        AppStore.emitChange()
      }, 3000)
      return
    }
    AppStore.data.submitting = true
    AppStore.emitChange()
    const user = {
      first_name: email,
      email,
      user_type: 'Client',
      password: random_password,
      grant_type: 'password',
      is_shadow: true
    }
    AppDispatcher.dispatch({
      action: 'sign-up-shadow',
      user,
      redirect_to: ''
    })
  }
  hideModal() {
    delete AppStore.data.show_signup_confirm_modal
    AppStore.emitChange()
  }
  resend() {
    const data = this.props.data
    const new_user = data.new_user
    const user = {
      first_name: new_user.email,
      email: new_user.email,
      user_type: 'Client',
      password: new_user.random_password,
      grant_type: 'password',
      is_shadow: true
    }
    AppStore.data.resent_email_confirmation = true
    AppDispatcher.dispatch({
      action: 'sign-up-shadow',
      user,
      redirect_to: ''
    })
  }
  hideFilterErrorModal() {
    delete AppStore.data.show_filter_error_modal
    AppStore.emitChange()
  }
  render() {
    const data = this.props.data
    const user = data.user
    const listing_map = data.listing_map
    let main_style = S('absolute h-100p' + (user ? ' l-70' : ' l-0'))
    if (data.is_mobile || data.is_widget) {
      main_style = {
        ...main_style,
        ...S('l-0 w-100p')
      }
    }
    let loading
    if (listing_map && listing_map.is_loading) {
      let loading_style = S('z-1 center-block absolute h-0 w-100p t-80 z-2')
      if (data.is_mobile) {
        loading_style = {
          ...loading_style,
          ...S('fixed t-60')
        }
      }
      loading = (
        <div id="loading" style={ loading_style }>
          <div style={ S(`br-20 color-fff w-190 h-29 pt-5 center-block text-center bg-${Brand.color('primary', '3388ff')}`) }>Loading MLS&reg; Listings...</div>
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
          hideListingViewer={ controller.listing_viewer.hideListingViewer.bind(this) }
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
    let toolbar_style = {
      ...S('h-66 p-10 bg-f8fafb'),
      borderBottom: '1px solid #dcd9d9'
    }
    if (data.is_widget)
      toolbar_style = S('relative t-20n h-0 p-0 w-100p')
    let remove_drawing_button
    if (data.show_search_map && window.poly && window.poly_search) {
      let right_value = 80
      if (data.listing_panel)
        right_value = 910
      remove_drawing_button = (
        <Button
          onClick={ controller.listing_map.removeDrawing.bind(this) }
          bsStyle="danger"
          className="transition"
          style={ S('absolute z-10 t-160 br-100 w-50 h-50 color-fff pt-1 font-30 text-center r-' + right_value) }
        >
          &times;
        </Button>
      )
    }
    let zoom_right = 'r-25'
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
    let create_alert_button
    if (data.show_search_map) {
      let save_search_btn_style = S(`absolute r-5 t-50 z-1 w-130 h-40 font-18 color-fff border-1-solid-${Brand.color('primary', '2196f3')} bg-${Brand.color('primary', '2196f3')}`)

      if (data.is_widget && !data.is_mobile) {
        save_search_btn_style = {
          ...save_search_btn_style,
          ...S('t-20')
        }
      }
      create_alert_button = (
        <Button style={ save_search_btn_style } type="button" onClick={ controller.alert_share.handleAlertShareClick.bind(this) }>
          { (user && user.user_type === 'Agent') ? 'Create Alert' : 'Save Search' }
        </Button>
      )
    }
    let signup_form
    if (data.show_signup_form) {
      let popover = <Popover id="popover" className="hidden" />
      if (data.errors) {
        if (data.errors.type === 'email-invalid') {
          popover = (
            <Popover id="popover" title="">You must enter a valid email</Popover>
          )
        }
        if (data.errors.type === 'bad-request') {
          popover = (
            <Popover id="popover" title="">Bad request.</Popover>
          )
        }
      }
      const signup_input_style = {
        ...S(`h-46 ${data.is_mobile ? 'w-200' : 'w-230'}`),
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      }
      const signup_btn_style = {
        ...S('h-46 w-130'),
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        backgroundColor: '#' + Brand.color('primary', '006aff'),
        borderColor: '#' + Brand.color('primary', '006aff')
      }
      let signup_form_style = S('absolute w-450 h-175 br-3 t-130 r-20 bg-fff p-20 z-2')
      if (data.is_widget) {
        signup_form_style = {
          ...signup_form_style,
          ...S('t-80')
        }
      }
      if (data.is_mobile) {
        signup_form_style = {
          ...signup_form_style,
          ...S('w-100p r-0')
        }
      }
      signup_form = (
        <div style={ signup_form_style }>
          <div onClick={ this.handleCloseSignupForm } className="close" style={ S('absolute r-15 t-10') }>&times;</div>
          <div className="din" style={ S('font-30 color-263445 mb-5') }>Get the Fastest Listing Alerts</div>
          <div style={ S('mb-5 w-100p') }>
            <form style={ S('mb-5 center-block pull-left w-100p block') } onSubmit={ this.handleEmailSubmit.bind(this) }>
              <div style={ S('pull-left') }>
                <OverlayTrigger trigger="focus" placement="bottom" overlay={ popover }>
                  <FormControl inputRef={ ref => this.emailInput = ref } style={ signup_input_style } type="text" placeholder="Enter email to save this search" />
                </OverlayTrigger>
              </div>
              <div style={ S('pull-left') }>
                <Button className={ data.submitting ? 'disabled' : '' } bsStyle="primary" style={ signup_btn_style } type="submit">{ data.submitting ? 'Submitting...' : 'Lets Go' }</Button>
              </div>
            </form>
            <div className="clearfix"></div>
          </div>
          <div style={ S('color-9b9b9b text-center') }>Already have an account? <a href="/signin" target="_parent">Log in</a></div>
        </div>
      )
    }
    if (listing_map && listing_map.listings) {
      let viewing_type_button_group_style = S('absolute t-9 r-0 mr-10 z-10')
      if (data.is_widget)
        viewing_type_button_group_style = S('absolute t-36 l-600 w-200 z-2')
      let btn_style = { ...S('bg-f8fafb h-47'), outline: 'none' }
      if (data.is_widget) {
        btn_style = {
          ...btn_style,
          ...S('w-50 h-52')
        }
      }
      let globe_color = '929292'
      if (!data.listing_panel)
        globe_color = Brand.color('primary', '3388ff')

      let list_color = '929292'
      if (data.listing_panel && data.listing_panel.view === 'list')
        list_color = Brand.color('primary', '3388ff')

      let photos_color = '929292'
      if (data.listing_panel && data.listing_panel.view === 'photos' && data.listing_panel.size === 'full')
        photos_color = Brand.color('primary', '3388ff')

      results_actions = (
        <div>
          <div style={ S('absolute r-5 mt-2 t-15 z-10') }>
            { create_alert_button }
            { signup_form }
          </div>
          <ButtonGroup style={ viewing_type_button_group_style }>
            <Button style={ btn_style } onClick={ controller.listing_panel.hideListingPanel.bind(this) }>
              <div style={ S('mt-3') }>
                <SvgGlobe color={`#${globe_color}`} />
              </div>
            </Button>
            <Button style={ btn_style } onClick={ controller.listing_panel.showPanelView.bind(this, 'list') }>
              <div style={ S('mt-5') }>
                <SvgList color={`#${list_color}`} />
              </div>
            </Button>
            <Button style={ btn_style } onClick={ controller.listing_panel.showPanelView.bind(this, 'photos', 'full') }>
              <div style={ S('mt-3') }>
                <SvgPhotos color={`#${photos_color}`} />
              </div>
            </Button>
          </ButtonGroup>
        </div>
      )
    }
    let search_input_text = ''
    if (data.listing_map && data.listing_map.search_input_text)
      search_input_text = data.listing_map.search_input_text
    const search_input_style = {
      ...S('font-18 bg-fff w-400 h-50 pull-left'),
      border: 'none'
    }
    // Non mobile search
    const search_input = data.search_input
    let listing_list
    if (search_input && search_input.listings) {
      const listings = search_input.listings
      const active_listing = search_input.active_listing
      listing_list = listings.map((listing, i) => {
        let bg_color = ''
        if (active_listing === i)
          bg_color = ' bg-EDF7FD'
        let cover_image = <div style={ S('bg-929292 w-87 h-50 color-fff text-center pt-15') }>No Image</div>
        if (listing.cover_image_url) {
          cover_image = (
            <div style={ S(`w-87 h-50 bg-cover bg-center bg-url(${listing.cover_image_url})`) }></div>
          )
        }
        return (
          <div onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) } key={ listing.id } className="search-listings__listing" style={ S('br-3 h-62 relative pointer p-5 ' + bg_color) }>
            <div className="pull-left" style={ S('mr-10') }>{ cover_image }</div>
            <div style={ S('mt-5') } className="pull-left">
              <span style={ S('color-666') }>
                <span style={ S('mr-10') }><b>{ listing.address.street_number } { listing.address.street_name } { listing.address.street_suffix }</b></span>
                <span style={ S('mr-10 font-12 color-929292') }>
                  <span style={ S('font-20 t-5 absolute color-' + listing_util.getStatusColor(listing.status)) }>&#8226;</span>
                  <span style={ S('ml-12') }>{ listing.status }</span>
                </span>
                <br/>
                <span style={ S('color-929292 font-10') }>{ listing.address.city }, { listing.address.state }</span>
              </span>
            </div>
            <div className="clearfix"></div>
          </div>
        )
      })
    }
    let listing_area
    if (listing_list) {
      listing_area = (
        <div style={ { overflow: 'scroll', ...S('w-504 bg-fff br-3 maxh-250 z-1 relative t-5') } }>{ listing_list }</div>
      )
    }
    let search_area = (
      <div>
        <form onSubmit={ controller.search_input_map.handleSearchSubmit.bind(this) }>
          <input
            id="google_search"
            onKeyDown={ controller.search_input_map.handleKeyDown.bind(this) }
            onChange={ controller.search_input_map.handleSearchInputChange.bind(this) }
            className="form-control"
            type="text"
            style={ search_input_style }
            value={ search_input_text }
            placeholder="Search location or MLS#"
          />
        </form>
      </div>
    )
    let nav_area = (
      <SideBar data={ data }/>
    )
    if (data.is_mobile && user) {
      nav_area = (
        <MobileNav data={ data }/>
      )
    }
    const draw_button_style = {
      ...S('mr-10 bg-fff h-52 w-50 br-5'),
      outline: 'none',
      border: 'solid 1px #d7d6d6',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.12), 0 0 4px 0 rgba(0, 0, 0, 0.1)'
    }
    const search_area_style = {
      ...S('pull-left mr-10 bg-fff border-1-solid-d7d6d6 br-5'),
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.12), 0 0 4px 0 rgba(0, 0, 0, 0.1)'
    }
    let clear_search_input
    if (data.listing_map && data.listing_map.search_input_text) {
      clear_search_input = (
        <div onClick={ this.handleClearSearchInputClick.bind(this) } className="close" style={ S('absolute l-340 t-15') }>&times;</div>
      )
    }
    let options_text
    if (listing_map && listing_map.listings_info)
      options_text = (listing_map.listings ? (listing_map.listings.length + ' showing of ' + listing_map.listings_info.total) : '') + ' homes. ' + listing_map.listings_info.proposed_title
    if (listing_map && data.listing_map.search_input_text && listing_map.no_listings_found)
      options_text = 'No listings found'
    const options_gist = (
      <div style={ S('relative mt-10 w-504') }>
        <div style={ S('z-0 op-.4 bg-000 absolute w-504 h-40 br-3') }></div>
        <div style={ S('z-1 color-fff p-10 relative w-504') }>{ options_text }</div>
      </div>
    )
    let draw_color = '929292'
    if (data.listing_map && data.listing_map.drawable)
      draw_color = Brand.color('primary', '3388ff')

    let search_filter_draw_area = (
      <div style={ S('relative t-35 l-10 z-1 w-580') }>
        <div style={ search_area_style }>
          <div style={ S('pull-left mr-10 relative') }>
            { search_area }
            { clear_search_input }
            <img onClick={ controller.search_input_map.handleSearchSubmit.bind(this) } style={ S('absolute r-15 t-15 w-20 pointer') } src="/static/images/dashboard/mls/search.svg" />
            <div style={ S('w-1 h-28 absolute l-400 t-13 bg-dddddd') }></div>
          </div>
          <div style={ S('pull-left') }>
            <Button id="open_filters" onClick={ controller.listing_filter.showFilterForm.bind(this, 'photos') } style={ { ...S('h-50 border-1-solid-fff pt-15'), outline: 'none' } }>
              <div style={ S('w-20 mr-10 pull-left') }>
                <SvgFilters color={'#929292'} />
              </div>
              <span className={ data.show_filter_form ? 'text-primary' : '' }>Filters</span>
            </Button>
          </div>
        </div>
        <div style={ S('pull-left') }>
          <Button onClick={ controller.listing_map.toggleDrawable.bind(this) } style={ draw_button_style }>
            <div style={ S('w-20 relative t-3 l-3') }>
              <SvgDraw color={`#${draw_color}`} />
            </div>
          </Button>
        </div>
        <div className="clearfix"></div>
        { listing_area }
        { !listing_area ? options_gist : '' }
      </div>
    )
    // Hide search form
    if (data.show_filter_form || data.show_alerts_map || data.show_actives_map)
      search_filter_draw_area = ''
    const underline = <div style={ S(`w-100p h-6 bg-${Brand.color('primary', '3388ff')} absolute b-11n`) }></div>
    const map_tabs = (
      <ul style={ S('relative l-30n t-5') }>
        <li style={ S('relative pull-left font-28 mr-60') }>
          <span onClick={ this.handleTabClick.bind(this, 'search') } style={ S('pointer ' + (data.show_search_map ? 'color-263445' : 'color-8696a4')) }>Search</span>
          { data.show_search_map && !data.show_alerts_map ? underline : '' }
        </li>
        <li style={ S('relative pull-left color-263445 font-28 mr-60') }>
          <span onClick={ this.handleTabClick.bind(this, 'alerts') } style={ S('pointer ' + (data.show_alerts_map ? 'color-263445' : 'color-8696a4')) }>Saved Searches</span>
          { data.show_alerts_map ? underline : '' }
        </li>
        <li style={ S('relative pull-left color-263445 font-28 mr-60') }>
          <span onClick={ this.handleTabClick.bind(this, 'actives') } style={ S('pointer ' + (data.show_actives_map ? 'color-263445' : 'color-8696a4')) }>Saved Listings</span>
          { data.show_actives_map ? underline : '' }
        </li>
      </ul>
    )
    let toolbar = (
      <nav style={ toolbar_style }>
        <div style={ !data.is_widget ? S('h-45 mt-10n') : {} }>{ user && !data.is_widget ? map_tabs : '' }</div>
        <div className="clearfix"></div>
        { search_filter_draw_area }
        { results_actions }
      </nav>
    )
    if (data.is_mobile) {
      search_area = (
        <form onSubmit={ controller.search_input_map.handleSearchSubmit.bind(this) }>
          <img onClick={ controller.search_input_map.handleSearchSubmit.bind(this) } src="/static/images/dashboard/mls/search.svg" style={ S('pointer w-22 h-22 absolute l-13 t-14') } />
          <input
            onChange={ controller.search_input_map.handleSearchInputChange.bind(this) }
            value={ search_input_text }
            className="form-control" type="text"
            style={ S('font-18 bg-dfe3e8 w-200 pull-left pl-40') }
            placeholder="Location or MLS#"
          />
        </form>
      )
      toolbar = (
        <nav style={ S('border-bottom-1-solid-ccc p-5 fixed t-0 w-100p z-10 bg-fff') }>
          <div style={ S('w-150 pull-left') }>
            { search_area }
          </div>
          <div style={ S('pull-right') }>
            <Button onClick={ controller.listing_map.toggleDrawable.bind(this) } style={ { ...S('mr-10'), outline: 'none' } }>
              <img src={ `/static/images/dashboard/mls/draw${data.listing_map && data.listing_map.drawable ? '-active' : ''}.svg` } style={ S('w-20') }/>
            </Button>
            <Button onClick={ controller.listing_filter.showFilterForm.bind(this, 'photos') } style={ { outline: 'none' } }>
              <img src={ `/static/images/dashboard/mls/filters${data.show_filter_form ? '-active' : ''}.svg` } style={ S('w-20 mr-10') }/>
              <span className={ data.show_filter_form ? 'text-primary' : '' }>Filters</span>
            </Button>
          </div>
          <div className="clearfix"></div>
          { create_alert_button }
          { signup_form }
        </nav>
      )
    }
    // Create markers
    // Show listings map
    let map_wrapper_style = S('h-' + (window.innerHeight - 66))
    if (data.is_mobile || data.is_widget)
      map_wrapper_style = S('fixed w-100p h-100p t-0')
    let content_area
    // Show alerts map
    if (data.show_alerts_map) {
      map_wrapper_style = {
        ...map_wrapper_style,
        ...S('pl-350')
      }
    }
    content_area = <MlsMap data={ data } />
    // Show search
    if (data.listing_panel && data.listing_panel.size) {
      content_area = (
        <div style={ S(`absolute h-100p w-${window.innerWidth - 425 - 70}`) }>
          { content_area }
        </div>
      )
      if (data.listing_panel.size === 'full')
        content_area = null
    }
    let alert_list_area
    let alert_viewer_area
    if (data.show_alerts_map) {
      const alert_header_style = {
        ...S('h-42 absolute t-66 w-' + (window.innerWidth - 420))
      }
      const alert_header_bg = {
        ...alert_header_style,
        ...S('bg-000 t-0 z-0'),
        opacity: '.5'
      }
      let alert_header_area
      if (data.show_alerts_map && data.current_alert) {
        const current_alert = data.current_alert
        let new_listings_link = 'Loading...'
        if (current_alert.feed && current_alert.feed_info)
          new_listings_link = current_alert.feed.length ? `View new listings (${current_alert.feed_info.total})` : 'No new listings'
        alert_header_area = (
          <div style={ alert_header_style }>
            <div style={ alert_header_bg }></div>
            <div style={ S('relative ml-15 mt-10 color-fff z-1 font-15') }>
              { data.listing_map.listings_info.proposed_title }
              <div style={ S('pull-right pointer') } onClick={ controller.alert_map.showAlertViewer.bind(this) }>
                <span style={ S('color-98caf1 mr-15') }>{ new_listings_link }</span>
                <span className={ !current_alert.feed || (current_alert.feed && !current_alert.feed.length) ? 'hidden' : '' } style={ S('mr-15 relative t-2') }><i style={ S('color-98caf1') } className="fa fa-chevron-right"></i></span>
              </div>
            </div>
          </div>
        )
      }
      alert_list_area = (
        <div>
          <AlertList data={ data } />
          { alert_header_area }
        </div>
      )
      if (data.show_alert_viewer) {
        alert_viewer_area = (
          <AlertViewer
            data={ data }
          />
        )
      }
    }
    // Share type modal
    const share_type_modal_area = (
      <ShareTypeModal
        data={ data }
      />
    )
    // Error tooltip
    let share_alert_error_tooltip
    if (listing_map && listing_map.show_share_alert_error_tooltip && !data.current_listing) {
      let warning_style = {
        ...S('absolute r-260 t-87 bg-fff w-347 h-210 border-1-solid-d7d6d6 text-center p-30 z-10'),
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.12), 0 0 4px 0 rgba(0, 0, 0, 0.1)'
      }
      if (data.is_mobile) {
        warning_style = {
          ...warning_style,
          ...S('l-10 t-10 w-' + (window.innerWidth - 20))
        }
      }
      share_alert_error_tooltip = (
        <div style={ warning_style }>
          <div className="din" style={ S('font-26 color-fe3824 mb-10') }>TOO MANY LISTINGS!</div>
          <div style={ S('font-15 mb-20') }>
            We allow up to <strong>200</strong> listings per alert.<br />
            You have <strong>{ listing_map.listings_info.total }</strong> in your search right now.<br />
            Please either zoom in or add more filters.
          </div>
          <div onClick={ controller.listing_map.hideModal } style={ S('font-17 color-9b9b9b pointer') }>Close</div>
        </div>
      )
    }
    let signup_message
    if (!data.user) {
      signup_message = (
        <div style={ S(`absolute ${data.is_mobile ? 'b-20 l-10' : 'b-50 l-20'} color-fff`) }>
          <div style={ S('absolute bg-000 op-.5 br-3 h-36 w-100p z-0') }></div>
          <div style={ S('z-1 relative pt-8 text-center pl-15 pr-15') }><a style={ { textDecoration: 'underline', ...S('color-fff') } } href="/signup">Sign up</a> or <a style={ { textDecoration: 'underline', ...S('color-fff') } } href="/signin">log in</a> to save listings and chat with our agents.</div>
        </div>
      )
    }
    let powered_by
    if (data.widget || data.brand) {
      powered_by = (
        <a href="https://rechat.com" style={ S(`font-12 w-150 h-30 text-center absolute ${data.is_mobile ? 'b-55 l-10' : 'b-50 r-100'} color-fff bg-2196f3 br-3 pt-7`) }>
          Powered by <strong>Rechat<sup>TM</sup></strong>
        </a>
      )
    }
    let brand_logo
    if (!data.is_widget && !data.user && Brand.asset('site_logo_wide')) {
      const host = 'https://' + window.location.host
      brand_logo = (
        <div style={ S('pull-left z-3 absolute p-16') }>
          <a href={ host }>
            <img style={ S('maxw-200 maxh-40') } src={ Brand.asset('site_logo_wide') } />
          </a>
        </div>
      )
    }
    const main_content = (
      <main>
        { brand_logo }
        { user && !data.is_widget ? nav_area : '' }
        <div className={ main_class } style={ main_style }>
          { /* this.cacheImages() */ }
          { toolbar }
          { loading }
          <div style={ map_wrapper_style }>
            { remove_drawing_button }
            { content_area }
            { alert_list_area }
            { alert_viewer_area }
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
          hideFilterForm={ controller.listing_filter.hideFilterForm }
          showSchoolDistrictsList={ controller.listing_filter.showSchoolDistrictsList }
          changeSchoolDistrictsSelected={ controller.listing_filter.changeSchoolDistrictsSelected }
          changeSchoolsSelected={ controller.listing_filter.changeSchoolsSelected }
          showAreasList={ controller.listing_filter.showAreasList }
          changeAreasSelected={ controller.listing_filter.changeAreasSelected }
          changeSubAreasSelected={ controller.listing_filter.changeSubAreasSelected }
          showCountiesList={ controller.listing_filter.showCountiesList }
          changeCountiesSelected={ controller.listing_filter.changeCountiesSelected }
          changeHomeStylesSelected={ controller.listing_filter.changeHomeStylesSelected }
          showSubdivisionsList={ controller.listing_filter.showSubdivisionsList }
          changeSubdivisionsSelected={ controller.listing_filter.changeSubdivisionsSelected }
        />
        { zoom_controls }
        { listing_map && listing_map.show_share_type_modal ? share_type_modal_area : '' }
        { listing_map && listing_map.show_share_alert_error_tooltip ? share_alert_error_tooltip : '' }
        <ShareAlertModal
          data={ data }
          shareAlert={ controller.alert_share.shareAlert }
          handleFilterChange={ controller.share_modal.handleFilterChange }
          handleEmailChange={ controller.share_modal.handleEmailChange }
          handlePhoneNumberChange={ controller.share_modal.handlePhoneNumberChange }
          handleAddEmail={ controller.share_modal.handleAddEmail }
          handleAddPhoneNumber={ controller.share_modal.handleAddPhoneNumber }
          handleRemoveShareItem={ controller.share_modal.handleRemoveShareItem }
          addUsersToSearchInput={ controller.share_modal.addUsersToSearchInput }
          handleInputChange={ controller.share_modal.handleInputChange }
        />
        <Modal dialogClassName="modal-alert-saved" show={ data.show_alert_saved_modal } onHide={ controller.listing_map.hideModal }>
          <div className="din" style={ S('text-center font-60 color-fff') }>
            <div style={ S('bg-2196f3 w-165 h-165 br-100 center-block pt-35') }>
              <img style={ S('h-70 ml-13') } src="/static/images/dashboard/mls/alert-bell-saved.svg" />
            </div>
            <span style={ { textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' } }>Alert Saved</span>
          </div>
        </Modal>
        <Modal dialogClassName="modal-alert-saved" show={ data.show_listing_shared_modal } onHide={ controller.listing_map.hideModal }>
          <div className="din" style={ S('text-center font-60 color-fff') }>
            <div style={ S('bg-2196f3 w-165 h-165 br-100 center-block pt-35') }>
              <i className="fa fa-check" style={ S('h-70 mt-20') }></i>
            </div>
            <span style={ { textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' } }>Listing Shared</span>
          </div>
        </Modal>
        { signup_message }
        { powered_by }
      </main>
    )
    let mobile_splash_viewer
    if (data.show_mobile_splash_viewer)
      mobile_splash_viewer = <MobileSplashViewer data={ data } />
    return (
      <div style={ S('minw-1000') }>
        { main_content }
        <Modal dialogClassName={ data.is_mobile ? 'modal-mobile' : '' } show={ data.show_welcome_modal } onHide={ this.hideWelcomeModal }>
          <Modal.Body style={ S('text-center p-50') }>
            <div style={ S('font-42') }>Welcome to Rechat!</div>
            <div style={ S('font-22 color-9b9b9b') }>The Real Estate app that Elevates Your Game</div>
            <div style={ S('mt-20 mb-20 h-156') }>
              <img style={ S('w-100p') } src="/static/images/signup/value-faces.png" />
            </div>
            <Button bsStyle="primary" style={ S('w-100p') } onClick={ this.hideWelcomeModal }>Start Using Rechat</Button>
          </Modal.Body>
        </Modal>
        <CheckEmailModal
          data={ data }
          hideModal={ this.hideModal }
          showIntercom={ this.showIntercom }
          resend={ this.resend }
        />
        <Modal dialogClassName={ data.is_mobile ? 'modal-mobile' : '' } show={ data.show_filter_error_modal } onHide={ this.hideFilterErrorModal }>
          <Modal.Body style={ S('text-center p-50') }>
            <div className="close" onClick={ this.hideFilterErrorModal } style={ S('absolute t-15 r-15 font-26') }>&times;</div>
            <div style={ S('font-22 color-9b9b9b mb-30') }>You must select at least one listing status</div>
            <Button bsStyle="primary" onClick={ this.hideFilterErrorModal }>Ok</Button>
          </Modal.Body>
        </Modal>
        { mobile_splash_viewer }
      </div>
    )
  }
}
Mls.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  routeParams: React.PropTypes.object,
  history: React.PropTypes.object
}
