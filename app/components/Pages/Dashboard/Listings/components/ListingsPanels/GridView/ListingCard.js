import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import helpers from '../../../../../../../utils/helpers'
import listingUtils from '../../../../../../../utils/listing'

import FavoriteHeart from '../../FavoriteHeart'
import prepareProps from '../prepareListingViewItemProps'
import { setMapHoveredMarkerId } from '../../../../../../../store_actions/listings/map'

const ListingCard = ({
  user,
  listing,
  activePanel,
  onMouseEnter,
  onMouseLeave
}) => {
  const props = prepareProps(user, listing)

  return (
    <div
      className="c-listing-card"
      style={props.backgroundImage}
      onMouseEnter={activePanel === 'map' ? () => onMouseEnter(listing.id) : ''}
      onMouseLeave={activePanel === 'map' ? onMouseLeave : ''}>
      <Link to={`/listings/${listing.id}`} className="c-listing-card__link" />
      <div className="c-listing-card__content-wrapper">
        {props.statusColor &&
          <div>
            <span
              className="c-listing-card__status"
              style={{ background: `#${props.statusColor}` }}>
              {listing.status}
            </span>
          </div>}
        <h4 className="c-listing-card__title">
          {props.address}
        </h4>
        <h5 className="c-listing-card__price">
          {props.price}
        </h5>
        <div className="c-listing-card__details">
          <span>{props.beds} Beds</span>
          &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
          <span>{props.baths} Baths</span>
          &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
          <span>{props.sqft} Sqft</span>
          &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
          <span>{props.builtYear}</span>
        </div>
      </div>
      <div className="c-listing-card__favorite-heart">
        <FavoriteHeart listing={listing} />
      </div>
    </div>
  )
}

export default compose(
  connect(({ data }) => ({ user: data.user }), { setMapHoveredMarkerId }),
  withHandlers({
    onMouseEnter: ({ setMapHoveredMarkerId, tabName }) => id => {
      setMapHoveredMarkerId(tabName, id)
    },
    onMouseLeave: ({ setMapHoveredMarkerId, tabName }) => () => {
      setMapHoveredMarkerId(tabName, -1)
    }
  })
)(ListingCard)
