// Widgets/Listings/index.js
import React, { Component } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
import S from 'shorti'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import Loading from '../../../Partials/Loading'
import ListingCard from './Partials/ListingCard'
import AppStore from '../../../../stores/AppStore'
import validator from 'validator'
// import _ from 'lodash'
import { randomString } from '../../../../utils/helpers'
export default class Listings extends Component {
  componentWillMount() {
    // AppStore.data.brand = {
    //   primary: '2196f3'
    // }
    AppStore.data.is_widget = true
    AppStore.emitChange()
    let subdomain = window.location.host.split('.')[0]
    if (window.location.host.indexOf('.') === -1)
      subdomain = 'claystapp'
    AppDispatcher.dispatch({
      action: 'get-branding',
      subdomain
    })
  }
  componentDidMount() {
    this.listenToScroll()
    const data = this.props.data
    const user = data.user
    // Set user
    AppStore.data.user = user
    const location = data.location
    const brokerage = location.query.brokerage
    const options = this.initOptions(brokerage)
    AppStore.data.widget = {
      options
    }
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts-widget',
      user,
      options
    })
    if (!user)
      return
    ListingDispatcher.dispatch({
      action: 'get-favorites',
      user
    })
  }
  listenToScroll() {
    window.onscroll = () => {
      const scroll_position = window.innerHeight + document.body.scrollTop
      // Within 100 of bottom
      if ((scroll_position + 100) > document.body.scrollHeight) {
        if (AppStore.data.widget.loaded_all)
          return
        if (AppStore.data.widget.options.listing_statuses[0] !== 'Sold')
          return
        if (AppStore.data.widget.is_loading_listings)
          return
        if (AppStore.data.widget.is_loading)
          return
        this.triggerNextPage()
      }
    }
  }
  triggerNextPage() {
    const data = this.props.data
    const user = data.user
    const options = data.widget.options
    AppStore.data.widget.options = options
    AppStore.data.widget.is_loading = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'page-listings-widget',
      user,
      options
    })
  }
  initOptions(brokerage) {
    const options = {
      limit: '75',
      maximum_lot_square_meters: 100000000,
      minimum_bathrooms: 0,
      maximum_square_meters: 10000000,
      location: {
        longitude: -96.79698789999998,
        latitude: 32.7766642
      },
      horizontal_distance: 2830,
      property_types: ['Residential', 'Residential Lease', 'Lots & Acreage'],
      vertical_distance: 2830,
      minimum_square_meters: 0,
      listing_statuses: ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract', 'Pending'],
      minimum_lot_square_meters: 0,
      currency: 'USD',
      maximum_year_built: 2016,
      minimum_year_built: 0,
      points: null,
      minimum_bedrooms: 0,
      minimum_price: 0,
      open_house: false,
      property_subtypes: ['RES-Single Family', 'RES-Half Duplex', 'RES-Farm\/Ranch', 'RES-Condo', 'RES-Townhouse', 'LSE-Apartment', 'LSE-Condo/Townhome', 'LSE-Duplex', 'LSE-Fourplex', 'LSE-House', 'LSE-Mobile', 'LSE-Triplex'],
      list_offices: [brokerage]
    }
    return options
  }
  handleButtonClick(type) {
    const data = this.props.data
    const user = data.user
    const options = data.widget.options
    AppStore.data.widget.is_loading_listings = true
    if (type === 'sold') {
      options.listing_statuses = ['Sold']
      AppStore.data.widget.is_showing_sold = true
    } else {
      options.listing_statuses = ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract', 'Pending']
      delete AppStore.data.widget.is_showing_sold
    }
    delete AppStore.data.signup_tooltip
    AppStore.data.widget.options = options
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts-widget',
      user,
      options
    })
  }
  handleCloseSignupForm() {
    delete AppStore.data.signup_tooltip
    AppStore.emitChange()
  }
  showIntercom(e) {
    e.preventDefault()
    window.Intercom('show')
  }
  handleListingInquirySubmit(e) {
    const data = AppStore.data
    const user = data.user
    AppStore.data.submitting = true
    AppStore.emitChange()
    e.preventDefault()
    AppDispatcher.dispatch({
      action: 'listing-inquiry',
      user,
      agent: data.signup_tooltip.list_agent.id,
      listing: data.signup_tooltip.listing
    })
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
    const email = this.refs.email.refs.input.value
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
    delete AppStore.data.errors
    delete AppStore.data.show_signup_confirm_modal
    delete AppStore.data.signup_tooltip
    AppStore.emitChange()
  }
  resend(e) {
    e.preventDefault()
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
  handleListingClick(listing) {
    const url = '/dashboard/mls/' + listing.id
    window.open(url, '_blank')
  }
  handleAgentClick(listing) {
    delete AppStore.data.show_signup_confirm_modal
    AppStore.data.signup_tooltip = {
      action: 'listing_inquiry',
      list_agent: listing.list_agent,
      listing: listing.id
    }
    AppStore.emitChange()
  }
  handleLoginClick(listing_id) {
    const data = this.props.data
    const url = 'https://' + data.brand.subdomain + '.rechat.com/signin?redirect_to=dashboard/mls/' + listing_id
    window.top.location.href = url
  }
  render() {
    // Data
    const data = this.props.data
    const widget = data.widget
    if (!widget || widget.loading) {
      return (
        <div style={ S('text-center') }>
          <Loading />
        </div>
      )
    }
    const listings = widget.listings
    let listings_area
    if (listings) {
      listings_area = listings.map(listing => {
        return (
          <ListingCard
            handleEmailSubmit={ this.handleEmailSubmit }
            key={ listing.id }
            data={ data }
            listing={ listing }
            handleCloseSignupForm={ this.handleCloseSignupForm }
            handleListingClick={ this.handleListingClick }
            handleAgentClick={ this.handleAgentClick }
            handleListingInquirySubmit={ this.handleListingInquirySubmit }
            handleLoginClick={ this.handleLoginClick }
            showIntercom={ this.showIntercom }
            resend={ this.resend }
            hideModal={ this.hideModal }
          />
        )
      })
    }
    let view_all_button
    if (!data.location.query.all && data.brand && data.brand.listing_url) {
      view_all_button = (
        <div style={ S('text-center mt-20 mb-30') }>
          <a target="_parent" href={ data.brand.listing_url } className="btn btn-default" style={ S(`w-280 font-17 p-20 color-fff border-1-solid-${data.brand.primary} bg-${data.brand.primary}`) }>View Exclusive Listings</a>
        </div>
      )
    }
    let links_area = (
      <div>
        { view_all_button }
        <div style={ S('color-9b9b9b font-15 mb-40') } className="text-center">
          Powered by <a href="https://rechat.com" target="_blank" style={ S('color-2196f3 fw-500') }>Rechat<span style={ S('color-2196f3 font-9 relative t-7n fw-500') }>TM</span></a>
        </div>
      </div>
    )
    if (widget.is_loading_listings)
      listings_area = <Loading />
    if (widget.is_loading_listings)
      links_area = ''
    const header_style = S('text-center')
    const status_buttons_area_style = S('text-center mb-20')
    return (
      <div>
        <div style={ header_style }>
          <h1 className="din" style={ S('font-50 color-263445 mb-0' + (data.is_mobile ? ' ml-10 mr-10' : '')) }>Our Exclusive Listings</h1>
          <span style={ S('h-1 bg-e2e2e2 w-80 m-20 inline-block') }></span>
        </div>
        <div style={ status_buttons_area_style }>
          <ButtonGroup>
            <Button onClick={ this.handleButtonClick.bind(this, 'active')} style={ widget && widget.is_showing_sold ? S('color-929292 font-17 p-15 w-100') : S(`color-${data.brand.primary} font-17 p-15 w-100`) } bsStyle="default">Active</Button>
            <Button onClick={ this.handleButtonClick.bind(this, 'sold')} style={ widget && widget.is_showing_sold ? S(`color-${data.brand.primary} font-17 p-15 w-100`) : S('color-929292 font-17 p-15 w-100') } bsStyle="default">Sold</Button>
          </ButtonGroup>
        </div>
        { listings_area }
        <div className="clearfix"></div>
        { links_area }
      </div>
    )
  }
}

// PropTypes
Listings.propTypes = {
  data: React.PropTypes.object
}