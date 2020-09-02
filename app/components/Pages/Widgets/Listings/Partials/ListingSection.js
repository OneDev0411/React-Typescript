import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import ActionButton from 'views/components/Button/ActionButton'
import { primary } from 'views/utils/colors'

import ListingCard from './ListingCard'
import Loading from '../../../../Partials/Loading'
import Brand from '../../../../../controllers/Brand'
import getListing from '../../../../../store_actions/widgets/listings/get-listings'

import { getOptions } from './get-options'

class Section extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.props.getListing(this.options, this.params)
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.listings.length !== this.props.listings.length ||
      (prevProps.isFetching &&
        !this.props.isFetching &&
        this.props.listings.length === 0)
    ) {
      this.props.updateListingsCount(
        this.props.type,
        this.props.listings.length
      )
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  get params() {
    return {
      type: this.props.type,
      'order_by[]': 'price'
    }
  }

  get options() {
    const {
      type,
      user,
      brand,
      location: {
        query: { brokerage, agent, brand: brandId, limit }
      }
    } = this.props

    return getOptions(
      brokerage,
      agent,
      type,
      brandId || (brand && brand.id),
      user,
      limit
    )
  }

  handleResize = () => this.props.updateHeight()

  handleListingClick(listing) {
    window.open(`/dashboard/mls/${listing.id}`, '_blank')
  }

  getNextPage = () => {
    this.props.getListing(this.options, {
      ...this.params,
      offset: this.props.listings.length
    })
  }

  getContent = brandColor => {
    const { user, brand, listings } = this.props
    const defaultAvatar = Brand.asset('default_avatar', '', brand)

    if (this.props.isFetching && listings.length === 0) {
      return (
        <div style={{ textAlign: 'center' }}>
          <Loading />
        </div>
      )
    }

    return (
      <div>
        {listings.map(listing => (
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
      </div>
    )
  }

  render() {
    const { brand } = this.props
    const brandColor = Brand.color('primary', primary, brand)
    let content = this.getContent(brandColor)

    return content ? (
      <div style={{ overflow: 'auto', padding: '1.5rem' }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 1rem'
          }}
        >
          <h2
            style={{
              fontSize: '2.5rem',
              marginTop: 0,
              marginBottom: '1.rem'
            }}
          >
            {this.props.title}
          </h2>
          <div
            style={{
              width: 80,
              height: 1,
              background: '#e2e2e2',
              marginBottom: '2rem'
            }}
          />
        </div>

        {content}

        {this.props.listings.length > 0 &&
          this.props.listingsInfo.total > this.props.listings.length && (
            <>
              {this.props.isFetching && (
                <div style={{ textAlign: 'center' }}>
                  <Loading />
                </div>
              )}
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
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
            </>
          )}
      </div>
    ) : null
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
