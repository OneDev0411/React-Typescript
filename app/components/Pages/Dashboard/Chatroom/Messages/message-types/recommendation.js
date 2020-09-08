import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import util from '../../../../../../utils/listing'
import ListingModalViewer from '../../../Listings/components/ListingModalViewer'

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
  // get listing
  const { listing } = recommendation
  const { property, status } = listing

  return (
    <div className="recommendation">
      <strong style={{ color: '#9b9a9b' }}>Shared a listing:</strong>
      <div>{comment}</div>

      <ListingModalViewer
        listing={listing}
        show={showListingModal}
        onHide={() => toggleModal(false)}
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

          <ul className="details">
            <li>{property.bedroom_count} Beds</li>
            <li>{property.bathroom_count} Baths</li>
            <li>{util.metersToFeet(property.square_meters)} Sqft</li>
            <li>{property.lot_size_area} Lot</li>
          </ul>
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
