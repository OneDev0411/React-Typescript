import React from 'react'

import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

import { ListingDetailsModal } from 'components/ListingDetailsModal'
import util from 'utils/listing'

/**
 * renders a recommendation(== listing) message
 */
const Listing = ({
  comment,
  recommendation,
  /* internal props and states */
  getPrice,
  toggleModal,
  showListingModal
}) => {
  const { listing } = recommendation
  const { property, status } = listing

  return (
    <div className="recommendation">
      <strong style={{ color: '#9b9a9b' }}>Shared a listing:</strong>
      <div
        className="comment inline"
        dangerouslySetInnerHTML={{ __html: comment }}
      />

      <ListingDetailsModal
        isOpen={showListingModal}
        closeHandler={() => toggleModal(false)}
        listingId={listing.id}
      />

      <div className="listing" onClick={() => toggleModal(true)}>
        {listing.cover_image_url && (
          <img src={listing.cover_image_url} alt="MLS listing cover" />
        )}
        <div className="info">
          <div
            className="status"
            style={{ backgroundColor: `#${util.getStatusColor(status)}` }}
          >
            {status}
          </div>

          <div className="address-title">
            {util.addressTitle(property.address)}
          </div>

          <div className="price">${getPrice()}</div>
        </div>
      </div>
    </div>
  )
}

export default compose(
  withState('showListingModal', 'toggleModal', false),
  withHandlers({
    getPrice: props => () => {
      const { user, recommendation } = props
      const { listing } = recommendation

      let price = 0

      if (listing.close_price && user.user_type === 'Agent') {
        price = listing.close_price
      }

      price = listing.price

      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  })
)(Listing)
