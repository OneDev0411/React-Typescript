import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { compose, withState, withHandlers, lifecycle, pure } from 'recompose'
import util from '../../../../../../utils/listing'
import ListingModal from '../../../Mls/Listing/ListingModal'

const enhance = compose(
  pure,
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

      return price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  })
)

/**
 * renders a recommendation(== listing) message
 */
const Listing = ({
  user,
  author,
  message,
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
      <strong style={{ color: '#9b9a9b' }}>
        Shared a listing:
      </strong>
      <div>
        {comment}
      </div>

      <ListingModal
        listing={listing}
        show={showListingModal}
        onHide={() => toggleModal(false)}
      />

      <div
        className="listing"
        onClick={() => toggleModal(true)}
      >
        {
          listing.cover_image_url &&
          <img src={listing.cover_image_url} />
        }
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

          <div className="price">
            ${getPrice()}
          </div>

          <ul className="details">
            <li>{property.bedroom_count} Beds</li>
            <li>{property.bathroom_count} Baths</li>
            <li>{util.metersToFeet(property.square_meters)} Sqft</li>
            <li>{property.lot_square_meters.toFixed(0)} Lot</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default enhance(Listing)
