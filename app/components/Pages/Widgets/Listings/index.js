// Widgets/Listings/index.js
import React, { Component } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
import S from 'shorti'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import Loading from '../../../Partials/Loading'
import ListingCard from './Partials/ListingCard'
import AppStore from '../../../../stores/AppStore'
import Brand from '../../../../controllers/Brand'
import controller from '../../Dashboard/controller'
export default class Listings extends Component {
  componentWillMount() {
    AppStore.data.is_widget = true
    AppStore.emitChange()
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
      property_types: ['Residential', 'Residential Lease'],
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
  handleListingClick(listing) {
    const url = '/dashboard/mls/' + listing.id
    window.open(url, '_blank')
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
            handleEmailSubmit={ controller.action_bubble.handleEmailSubmit }
            key={ listing.id }
            data={ data }
            listing={ listing }
            handleCloseSignupForm={ controller.action_bubble.handleCloseSignupForm }
            handleListingClick={ this.handleListingClick }
            handleAgentClick={ controller.action_bubble.handleAgentClick }
            handleListingInquirySubmit={ controller.action_bubble.handleListingInquirySubmit }
            handleLoginClick={ controller.action_bubble.handleLoginClick }
            showIntercom={ controller.action_bubble.showIntercom }
            resend={ controller.action_bubble.resend }
            hideModal={ controller.action_bubble.hideModal }
          />
        )
      })
    }
    let view_all_button
    if (!data.location.query.all && Brand.asset('listing_url')) {
      view_all_button = (
        <div style={ S('text-center mt-20 mb-30') }>
          <a target="_parent" href={ Brand.asset('listing_url') } className="btn btn-default" style={ S(`w-280 font-17 p-20 color-fff border-1-solid-${Brand.color('primary')} bg-${Brand.color('primary')}`) }>View Exclusive Listings</a>
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
            <Button onClick={ this.handleButtonClick.bind(this, 'active')} style={ widget && widget.is_showing_sold ? S('color-929292 font-17 p-15 w-100') : S(`color-${Brand.color('primary')} font-17 p-15 w-100`) } bsStyle="default">Active</Button>
            <Button onClick={ this.handleButtonClick.bind(this, 'sold')} style={ widget && widget.is_showing_sold ? S(`color-${Brand.color('primary')} font-17 p-15 w-100`) : S('color-929292 font-17 p-15 w-100') } bsStyle="default">Sold</Button>
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