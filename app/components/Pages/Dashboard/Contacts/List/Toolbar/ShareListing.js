import React, { Fragment } from 'react'

import SearchListingModal from '../../../../../../views/components/SearchListing'

import InstantMarketing from '../../../../../../views/components/InstantMarketing'

import Compose from '../../../../../../views/components/EmailCompose'

class ShareListing extends React.Component {
  state = {
    listing: null,
    isListingsModalOpen: false,
    isInstantMarketingBuilderOpen: false
  }

  toggleListingModal = () =>
    this.setState(state => ({
      isListingsModalOpen: !state.isListingsModalOpen
    }))

  toggleInstantMarketingBuilder = () =>
    this.setState(state => ({
      isInstantMarketingBuilderOpen: !state.isInstantMarketingBuilderOpen
    }))

  onSelectListing = listing => {
    this.setState({
      listing,
      isInstantMarketingBuilderOpen: true,
      isListingsModalOpen: false
    })
  }

  handleSaveMarketingCard = template => {
    this.toggleInstantMarketingBuilder()

    console.log(template)
  }

  render() {
    const { listing } = this.state

    return (
      <Fragment>
        <div className="list--secondary-button">
          <button
            className="button c-button--shadow"
            onClick={this.toggleListingModal}
          >
            Share Listing
          </button>
        </div>

        <SearchListingModal
          show={this.state.isListingsModalOpen}
          modalTitle="Select a Listing"
          onHide={this.toggleListingModal}
          onSelectListing={this.onSelectListing}
        />

        <InstantMarketing
          isOpen={this.state.isInstantMarketingBuilderOpen}
          onClose={this.toggleInstantMarketingBuilder}
          handleSave={this.handleSaveMarketingCard}
          templateData={{ listing }}
          assets={listing && listing.gallery_image_urls}
        />

        <Compose />
      </Fragment>
    )
  }
}

export default ShareListing
