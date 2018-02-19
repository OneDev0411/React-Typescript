import React from 'react'
import { connect } from 'react-redux'

import ListingMobileView from './components/ListingMobileView'
import ListingDesktopView from './components/ListingDesktopView'
import logUserActivity from '../../../../../models/user/post-new-activity'
import getListing from '../../../../../store_actions/listings/listing/get-listing'

class Listing extends React.Component {
  state = {
    isLoggedActivity: false
  }

  componentDidMount() {
    this.initializeListing()
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.listing.id &&
      !this.props.listing.id &&
      !this.state.isLoggedActivity
    ) {
      this.logActivity(nextProps.listing)
    }
  }

  async initializeListing() {
    const { listingId, listing, getListing } = this.props

    if (!listingId) {
      return
    }

    if (!listing.id) {
      await getListing(listingId)
    } else {
      this.logActivity(listing)
    }
  }

  logActivity(object) {
    logUserActivity({
      object,
      object_class: 'listing',
      action: 'UserViewedListing'
    })
    this.setState({
      isLoggedActivity: true
    })
  }

  render() {
    let content = <ListingDesktopView {...this.props} />

    if (this.props.data.is_mobile) {
      content = <ListingMobileView {...this.props} />
    }

    return content
  }
}

function mapStateToProps(state, props) {
  const { user, listing } = state
  const { params: { id: listingId } } = props

  return {
    user,
    listingId: listingId || '',
    isFetching: listing.isFetching,
    errorMessage: listing.errorMessage,
    listing: listing.data.id === listingId ? listing.data : {}
  }
}

export default connect(mapStateToProps, { getListing })(Listing)
