import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import ListingMobileView from './components/ListingMobileView'
import ListingDesktopView from './components/ListingDesktopView'
import logUserActivity from '../../../../../models/user/post-new-activity'
import getListing from '../../../../../models/listings/listing/get-listing'
import changeListingFollowStatuses from '../../../../../models/listings/listing/change-listing-follow-status'
import listing_util from '../../../../../utils/listing'

class Listing extends React.Component {
  state = {
    isFetching: false,
    errorMessage: undefined,
    listing: {}
  }

  componentDidMount() {
    this.initializeListing()
  }

  async initializeListing() {
    const { id: listingId } = this.props.params

    if (!listingId) {
      return
    }

    this.setState({ isFetching: true })

    try {
      const listing = await getListing(listingId)

      this.setState({ listing, isFetching: false })

      if (listing.id) {
        this.logActivity(listingId)
      }
    } catch ({ response }) {
      const errorMessage =
        (response && response.body.message) || 'Something went wrong.'

      this.setState({ isFetching: false, errorMessage })
    }
  }

  logActivity(object) {
    logUserActivity({
      object,
      object_class: 'listing',
      action: 'UserViewedListing'
    })
  }

  onClickFollow = async statuses => {
    const { listing, isFetching } = this.state

    try {
      if (!isFetching) {
        this.setState({ isFetching: true })

        const response = await changeListingFollowStatuses(listing.id, statuses)
        const updatedListing = { ...listing, ...response.body.data }

        this.setState({ listing: updatedListing, isFetching: false })
      }
    } catch ({ response }) {
      const errorMessage =
        (response && response.body.message) || 'Something went wrong.'

      this.setState({ isFetching: false, errorMessage })
    }
  }

  render() {
    const { listing, isFetching, errorMessage } = this.state
    let pageTitle =
      listing && listing.property
        ? `${listing_util.addressTitle(listing.property.address)} | `
        : ''

    pageTitle = `${pageTitle}Properties | Rechat`

    let content = (
      <ListingDesktopView
        {...this.props}
        listing={listing}
        isFetching={isFetching}
        errorMessage={errorMessage}
        onClickFollow={this.onClickFollow}
      />
    )

    if (this.props.data.is_mobile) {
      content = (
        <ListingMobileView
          {...this.props}
          listing={listing}
          isFetching={isFetching}
          errorMessage={errorMessage}
        />
      )
    }

    return (
      <React.Fragment>
        <Helmet>
          <title> {pageTitle} </title>
        </Helmet>
        {content}
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    brand: state.brand
  }
}

export default connect(mapStateToProps)(Listing)
