import { connect } from 'react-redux'
import React, { Component } from 'react'
import ListingCard from './ListingCard'
import S from 'shorti'
import controller from '../../../Dashboard/controller'

import { Button } from 'react-bootstrap'
import Loading from '../../../../Partials/Loading'
import Brand from '../../../../../controllers/Brand'
import getListing from '../../../../../store_actions/widgets/listings/get-listings'

class Section extends Component {

  constructor() {
    super()
    this.state = {
      listings: [],
      isLoading: true
    }
  }

  componentDidMount() {
    const data = this.props.data
    this.options = this.initOptions(
      data.location.query.brokerage,
      data.location.query.agent,
      this.props.type,
      data.location.query.brand,
      data.user
    )
    this.widgetOptions = this.initWidgetOptions()
    this.props.getListing(this.options, this.widgetOptions)
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.listings.length !== this.props.listings.length
      || nextProps.isFetching !== this.props.isFetching
    )
  }

  handleListingClick(listing) {
    const url = `/dashboard/mls/${listing.id}`
    window.open(url, '_blank')
  }

  initWidgetOptions() {
    let queryString = ''
    if (this.options.list_offices && this.options.list_offices.length || this.options.brand) {
      queryString += '?associations=compact_listing.proposed_agent'

      if (this.options.listing_statuses[0] === 'Sold') {
        queryString += '&order_by[]=price'
      }
    }
    return {
      queryString,
      type: this.props.type
    }
  }

  initOptions(brokerage, agent, type, brand, user) {
    const options = {
      limit: '10',
      property_types: ['Residential', 'Residential Lease', 'Lots & Acreage'],
      property_subtypes: ['RES-Single Family', 'RES-Half Duplex', 'RES-Farm\/Ranch', 'RES-Condo', 'RES-Townhouse', 'LSE-Apartment', 'LSE-Condo/Townhome', 'LSE-Duplex', 'LSE-Fourplex', 'LSE-House', 'LSE-Mobile', 'LSE-Triplex', 'LND-Commercial', 'LND-Farm/Ranch', 'LND-Residential']
    }
    if (brokerage) {
      options.list_offices = [brokerage]
    }
    if (agent) {
      options.agents = [agent]
    }
    if (brand) {
      options.brand = brand
    }
    if (user) {
      options.access_token = user.access_token
    }
    if (type === 'sold') {
      options.listing_statuses = ['Sold', 'Leased']
    } else {
      options.listing_statuses = ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract', 'Pending']
    }
    return options
  }

  generateQueryString(query, newQuery, newValue) {
    if (query.indexOf('?') < 0) {
      return `${query}?${newQuery}=${newValue}`
    }
    return `${query}&${newQuery}=${newValue}`
  }

  triggerNextPage() {
    this.props.getListing(
      this.options,
      {
        ...this.widgetOptions,
        queryString: this.generateQueryString(this.widgetOptions.queryString, 'offset', this.props.listings.length)
      }
    )
  }

  render() {
    let showLoadMore
    if (this.props.listingsInfo.total > this.props.listings.length) {
      showLoadMore = true
    }
    return (
      <div className="futurastd listing-section">
        <div
          style={{
            textAlign: 'center',
            backgroundColor: '#fbfbfb',
            display: 'table',
            width: '100%',
            padding: '40px',
            marginBottom: '40px'
          }}
        >
          <h1
            style={S(`font-17 color-263445 mb-0${this.props.data.is_mobile ? ' ml-10 mr-10' : ''}`)}
          >{this.props.title}</h1>
          <span
            style={S('h-1 bg-e2e2e2 w-80 m-20 inline-block')}
          />
        </div>
        {this.props.listings && this.props.listings.map((listing, i) => (
          <ListingCard
            className="listing-card"
            handleEmailSubmit={controller.action_bubble.handleEmailSubmit}
            key={i}
            data={this.props.data}
            listing={listing}
            handleCloseSignupForm={controller.action_bubble.handleCloseSignupForm}
            handleListingClick={this.handleListingClick}
            handleAgentClick={controller.action_bubble.handleAgentClick}
            handleListingInquirySubmit={controller.action_bubble.handleListingInquirySubmit}
            handleLoginClick={controller.action_bubble.handleLoginClick}
            showIntercom={controller.action_bubble.showIntercom}
            resend={controller.action_bubble.resend}
            hideModal={controller.action_bubble.hideModal}
          />
        ))
        }
        <div
          className="clearfix"
        />
        {
          this.props.isFetching &&
          <div style={S('text-center')}>
            <Loading />
          </div>
        }
        {Brand.color('primary') && showLoadMore &&
        <div style={S('text-center')}>
          <Button
            onClick={this.triggerNextPage.bind(this, 'active')}
            style={{
              backgroundColor: `#${Brand.color('primary')}`,
              borderColor: `#${Brand.color('primary')}`,
              paddingLeft: '3em',
              paddingRight: '3em',
              fontSize: '1.2em'
            }}
            bsStyle="primary"
          >
            Load More
          </Button>
        </div>
        }
      </div>
    )
  }
}

export default connect(
  ({ widgets }, { type }) => {
    const listings = widgets.listings[type] || {}
    return {
      listings: listings.listings || [],
      listingsInfo: listings.listingsInfo || {},
      isFetching: listings.isFetching || false
    }
  },
  { getListing }
)(Section)
