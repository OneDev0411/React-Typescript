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

import { getOptions } from './get-options'

class Section extends Component {
  constructor(props) {
    super(props)

    const {
      location: { query }
    } = props

    this.options = getOptions(query.brokerage, query.agent, props.type)
  }

  componentDidMount() {
    this.props.getListing(this.options, this.params)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listings.length !== this.props.listings.length) {
      this.props.updateHeight()
    }
  }

  get params() {
    return {
      type: this.props.type,
      'order_by[]': 'price'
    }
  }

  handleListingClick(listing) {
    window.open(`/dashboard/mls/${listing.id}`, '_blank')
  }

  getNextPage = () => {
    this.props.getListing(this.options, {
      ...this.params,
      offset: this.props.listings.length
    })
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
          listings.map(listing => (
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
              onClick={this.getNextPage}
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
    ({ widgets, user, brand }, { type, location }) => {
      const listings = widgets.listings[type] || {}

      return {
        user,
        brand,
        location,
        listings: listings.listings || [],
        listingsInfo: listings.listingsInfo || {},
        isFetching: listings.isFetching || false
      }
    },
    { getListing }
  )(Section)
)
