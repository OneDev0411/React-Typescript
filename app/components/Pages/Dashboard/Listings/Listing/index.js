import { connect } from 'react-redux'
import React, { Component } from 'react'

import ListingView from './components/ListingView'
import ContactModel from '../../../../../models/Contact'
import getListing from '../../../../../store_actions/listings/listing/get-listing'

class Listing extends Component {
  componentDidMount() {
    const { id, getListing } = this.props

    if (!id) {
      return
    }

    getListing(id)
    ContactModel.updateUserTimeline('UserViewedListing', 'listing', id)
  }

  render() {
    const { data, listing, isFetching } = this.props

    return <ListingView data={data} listing={listing} isFetching={isFetching} />
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
