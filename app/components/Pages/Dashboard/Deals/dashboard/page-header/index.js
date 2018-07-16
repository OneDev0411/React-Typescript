import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { showAttachments } from '../../../../../../store_actions/deals'

import DealEmail from '../../dashboard/deal-email'

import InstantMarketing from '../../../../../../views/components/InstantMarketing'
import PageHeader from '../../../../../../views/components/PageHeader'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

import Listing from '../../../../../../models/listings/listing'

import { isBackOffice } from '../../../../../../utils/user-teams'

class Header extends React.Component {
  state = {
    listing: null
  }

  componentDidMount() {
    this.getDealListing()
  }

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
    const { deal } = this.props
    const { listing } = this.state

    const buttonStyle = {
      marginLeft: '10px',
      padding: '0.70em 1.5em'
    }

    return (
      <PageHeader title="Deals" backUrl="/dashboard/deals">
        <PageHeader.Menu>
          <DealEmail dealEmail={deal.email} />
          {deal.deal_type === 'Selling' && (
            <ActionButton
              style={buttonStyle}
              onClick={() =>
                browserHistory.push(`/dashboard/deals/${deal.id}/create-offer`)
              }
            >
              Add New Offer
            </ActionButton>
          )}

          <ActionButton
            inverse
            style={buttonStyle}
            onClick={() =>
              browserHistory.push(`/dashboard/deals/${deal.id}/files`)
            }
          >
            View & Upload Files
          </ActionButton>

          <ActionButton
            inverse
            style={buttonStyle}
            onClick={() => this.props.showAttachments()}
          >
            Get Signatures
          </ActionButton>

          {listing && (
            <InstantMarketing
              data={listing}
              assets={listing.gallery_image_urls}
            >
              <ActionButton inverse style={buttonStyle}>
                Promote
              </ActionButton>
            </InstantMarketing>
          )}
        </PageHeader.Menu>
      </PageHeader>
    )
  }
}

export default connect(
  ({ user }) => ({
    isBackOffice: isBackOffice(user)
  }),
  { showAttachments }
)(Header)
