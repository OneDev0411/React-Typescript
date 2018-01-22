import React, { Component } from 'react'
import { connect } from 'react-redux'
import ListingCard from './ListingCard'
import S from 'shorti'

import { Button } from 'react-bootstrap'
import Loading from '../../../../Partials/Loading'
import Brand from '../../../../../controllers/Brand'
import getListing from '../../../../../store_actions/widgets/listings/get-listings'

class Section extends Component {
  componentDidMount() {
    const { data } = this.props

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

  componentDidUpdate(prevProps) {
    if (prevProps.listings.length !== this.props.listings.length) {
      this.props.updateHeight()
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   return (
  //     nextProps.listings.length !== this.props.listings.length
  //     || nextProps.isFetching !== this.props.isFetching
  //   )
  // }

  handleListingClick(listing) {
    window.open(`/dashboard/mls/${listing.id}`, '_blank')
  }

  initWidgetOptions() {
    let queryString = ''

    if (
      (this.options.list_offices && this.options.list_offices.length) ||
      this.options.brand
    ) {
      queryString += '?associations=compact_listing.proposed_agent&order_by[]=price'
    }

    return {
      queryString,
      type: this.props.type
    }
  }

  initOptions(brokerage, agent, type, brand, user) {
    const options = {
      property_types: [
        'Residential',
        'Residential Lease',
        'Lots & Acreage',
        'Multi-Family'
      ],
      property_subtypes: [
        'RES-Single Family',
        'RES-Half Duplex',
        'RES-Farm/Ranch',
        'RES-Condo',
        'RES-Townhouse',
        'LSE-Apartment',
        'LSE-Condo/Townhome',
        'LSE-Duplex',
        'LSE-Fourplex',
        'LSE-House',
        'LSE-Mobile',
        'LSE-Triplex',
        'LND-Commercial',
        'LND-Farm/Ranch',
        'LND-Residential',
        'MUL-Full Duplex'
      ]
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
      options.limit = '6'
      options.listing_statuses = ['Sold', 'Leased']
    } else {
      options.listing_statuses = [
        'Active',
        'Active Contingent',
        'Active Kick Out',
        'Active Option Contract',
        'Pending'
      ]
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
    this.props.getListing(this.options, {
      ...this.widgetOptions,
      queryString: this.generateQueryString(
        this.widgetOptions.queryString,
        'offset',
        this.props.listings.length
      )
    })
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
            display: 'table',
            width: '100%',
            padding: '40px',
            marginBottom: '40px'
          }}
        >
          <h1
            style={S(`font-50 color-263445 mb-0${
                this.props.data.is_mobile ? ' ml-10 mr-10' : ''
              }`)}
          >
            {this.props.title}
          </h1>
          <span style={S('h-1 bg-e2e2e2 w-80 m-20 inline-block')} />
        </div>
        {this.props.listings &&
          this.props.listings.map((listing, i) => (
            <ListingCard
              className="listing-card"
              key={i}
              data={this.props.data}
              listing={listing}
              handleListingClick={this.handleListingClick}
            />
          ))}
        <div className="clearfix" />
        {this.props.isFetching && (
          <div style={S('text-center')}>
            <Loading />
          </div>
        )}
        {Brand.color('primary') &&
          showLoadMore && (
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
          )}
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
