import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import S from 'shorti'

import ActionButton from 'views/components/Button/ActionButton'
import { primary } from 'views/utils/colors'

import ListingCard from './ListingCard'
import Loading from '../../../../Partials/Loading'
import Brand from '../../../../../controllers/Brand'
import getListing from '../../../../../store_actions/widgets/listings/get-listings'

class Section extends Component {
  componentDidMount() {
    const { user, location } = this.props

    this.options = this.initOptions(
      location.query.brokerage,
      location.query.agent,
      this.props.type,
      location.query.brand,
      user
    )
    this.widgetOptions = this.initWidgetOptions()
    this.props.getListing(this.options, this.widgetOptions)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listings.length !== this.props.listings.length) {
      this.props.updateHeight()
    }
  }

  handleListingClick(listing) {
    window.open(`/dashboard/mls/${listing.id}`, '_blank')
  }

  initWidgetOptions() {
    let queryString = ''

    if (
      (this.options.list_offices && this.options.list_offices.length) ||
      this.options.brand
    ) {
      queryString +=
        '?associations=compact_listing.proposed_agent&order_by[]=price'
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

  sort = ({ price: a }, { price: b }) => {
    if (a > b) {
      return -1
    }

    if (b > a) {
      return 1
    }

    return 0
  }

  render() {
    let showLoadMore
    const { user, brand, listings } = this.props
    const brandColor = Brand.color('primary', primary, brand)
    const defaultAvatar = Brand.asset('default_avatar', '', brand)

    if (this.props.listingsInfo.total > listings.length) {
      showLoadMore = true
    }

    return (
      <div style={{ overflow: 'auto', marginBottom: '2em' }}>
        <div
          style={{
            textAlign: 'center',
            display: 'table',
            width: '100%',
            padding: '40px',
            marginBottom: '40px'
          }}
        >
          <h1 style={S('font-50 color-263445 mb-0')}>{this.props.title}</h1>
          <span style={S('h-1 bg-e2e2e2 w-80 m-20 inline-block')} />
        </div>
        {listings.length > 0 &&
          listings
            .sort(this.sort)
            .map(listing => (
              <ListingCard
                className="listing-card"
                key={listing.id}
                brandColor={brandColor}
                defaultAvatar={defaultAvatar}
                user={user}
                listing={listing}
              />
            ))}
        <div className="clearfix" />
        {this.props.isFetching && (
          <div style={S('text-center')}>
            <Loading />
          </div>
        )}

        {showLoadMore && (
          <div style={S('text-center')}>
            <ActionButton
              onClick={this.triggerNextPage.bind(this, 'active')}
              style={{
                backgroundColor: brandColor,
                paddingLeft: '3em',
                paddingRight: '3em'
              }}
            >
              Load More
            </ActionButton>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(
  connect(
    ({ widgets }, { type, location }) => {
      const listings = widgets.listings[type] || {}

      return {
        location,
        listings: listings.listings || [],
        listingsInfo: listings.listingsInfo || {},
        isFetching: listings.isFetching || false
      }
    },
    { getListing }
  )(Section)
)
