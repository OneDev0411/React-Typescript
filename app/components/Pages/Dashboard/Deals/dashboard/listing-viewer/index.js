import React from 'react'
import { Button } from 'react-bootstrap'
import ListingModal from '../../../Mls/Listing/ListingModal'
import getListing from '../../../../../../models/listings/listing/get-listing'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: false,
      listing: null,
      showListingModal: false
    }
  }

  async onRequestListing() {
    const { deal } = this.props

    this.setState({
      fetching: true
    })

    try {
      const listing = await getListing(deal.listing)
      this.setState({
        listing,
        showListingModal: true,
        fetching: false
      })
    } catch(e) {
      this.setState({
        fetching: false
      })
    }
  }

  render() {
    const { fetching, listing, showListingModal } = this.state
    const { deal } = this.props
    const mlsNumber = deal.mls_context && deal.mls_context.mls_number

    return (
      <div>
        <Button
          className="mls-viewer-button"
          disabled={fetching === true}
          onClick={() => this.onRequestListing()}
        >
          { fetching ? 'Loading ...' : `View MLS #${mlsNumber}` }
        </Button>

        <ListingModal
          listing={listing}
          show={showListingModal}
          onHide={() => this.setState({ showListingModal: false })}
        />
      </div>
    )
  }
}
