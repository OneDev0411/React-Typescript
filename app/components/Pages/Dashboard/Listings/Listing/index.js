import React from 'react'
import { connect } from 'react-redux'

import ListingMobileView from './components/ListingMobileView'
import ListingDesktopView from './components/ListingDesktopView'
import ContactModel from '../../../../../models/Contact'
import getListing from '../../../../../store_actions/listings/listing/get-listing'

class Listing extends React.Component {
  componentDidMount() {
    const { id, getListing } = this.props

    if (!id) {
      return
    }

    getListing(id)
    ContactModel.updateUserTimeline('UserViewedListing', 'listing', id)
  }

  render() {
    let content = <ListingDesktopView {...this.props} />

    if (this.props.data.is_mobile) {
      content = <ListingMobileView {...this.props} />
    }

    return content
  }
}

export default connect(
  ({ user, listing }, { params }) => {
    const { id: paramsId } = params
    const listingId = listing.data.id || ''

    return {
      user,
      id: paramsId || '',
      isFetching: listing.isFetching,
      errorMessage: listing.errorMessage,
      listing: listingId === paramsId ? listing.data : {}
    }
  },
  { getListing }
)(Listing)
