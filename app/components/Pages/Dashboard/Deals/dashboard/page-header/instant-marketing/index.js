import React, { Fragment } from 'react'

import InstantMarketing from '../../../../../../../views/components/InstantMarketing'

import ActionButton from '../../../../../../../views/components/Button/ActionButton'

import Listing from '../../../../../../../models/listings/listing'

export default class DealInstantMarketing extends React.Component {
  state = {
    listing: null,
    isInstantMarketingBuilderOpen: false
  }

  componentDidMount() {
    this.getDealListing()
  }

  toggleInstantMarketingBuilder = () =>
    this.setState(state => ({
      isInstantMarketingBuilderOpen: !state.isInstantMarketingBuilderOpen
    }))

  getDealListing = async () => {
    const { deal } = this.props

    let listing = {}

    if (deal.listing) {
      try {
        listing = await Listing.getListing(deal.listing)
      } catch (e) {
        console.log(e)
      }
    }

    this.setState({
      listing
    })
  }

  render() {
    const { listing } = this.state

    return (
      <Fragment>
        <ActionButton
          inverse
          style={this.props.buttonStyle}
          onClick={this.toggleInstantMarketingBuilder}
        >
          Promote
        </ActionButton>

        <InstantMarketing
          isOpen={this.state.isInstantMarketingBuilderOpen}
          onClose={this.toggleInstantMarketingBuilder}
          onSave={() => null}
          templateData={{ listing }}
          assets={listing && listing.gallery_image_urls}
        />
      </Fragment>
    )
  }
}
