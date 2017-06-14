import { connect } from 'react-redux'
import React, { Component } from 'react'

import BrandLogo from './components/BrandLogo'
import ListingModal from './components/ListingModal'
import ContactModel from '../../../../../models/Contact'
import getListing from '../../../../../store_actions/listings/listing/get-listing'

class Listing extends Component {
  componentDidMount() {
    const { user, id } = this.props

    if (!id) {
      return
    }

    this._fetchListing(id)

    if (user) {
      this._updateUserTimeline(user, id)
    }
  }

  _fetchListing(id) {
    const { getListing } = this.props
    getListing(id)
  }

  _updateUserTimeline(user, id) {
    ContactModel.updateUserTimeline(user, 'UserViewedListing', 'Listing', id)
  }

  render() {
    const { data, listing, isFetching } = this.props

    return (
      <div>
        <ListingModal data={data} listing={listing} isFetching={isFetching} />
        <BrandLogo data={data} />
      </div>
    )
  }
}

export default connect(
  ({ listing, data }, { params }) => {
    const { id: paramsId } = params
    const listingId = listing.data.id || ''

    return {
      user: data.user,
      id: paramsId || '',
      isFetching: listing.isFetching,
      listing: listingId === paramsId ? listing.data : {}
    }
  },
  { getListing }
)(Listing)
