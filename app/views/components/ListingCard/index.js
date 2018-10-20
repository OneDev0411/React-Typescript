import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import './styles/index.scss'

import FavoriteHeart from './FavoriteHeart'
import { prepareListingProps } from './helpers/prepare-listing-props'

const ListingCard = ({ user, listing }) => {
  const props = prepareListingProps(user, listing)

  return (
    <div className="listing-card">
      <div style={props.backgroundImage} className="listing-card__inner">
        <div className="listing-card__content-wrapper">
          {props.statusColor && (
            <div>
              <span
                className="listing-card__status"
                style={{ background: `#${props.statusColor}` }}
              >
                {listing.status}
              </span>
            </div>
          )}
          <h4 className="listing-card__title">{props.address}</h4>
          <h5 className="listing-card__price">$ {props.price}</h5>
          <div className="listing-card__details">
            <span>{props.beds} Beds</span>
            &nbsp;&nbsp;&middot;&nbsp;&nbsp;
            <span>{props.baths} Baths</span>
            &nbsp;&nbsp;&middot;&nbsp;&nbsp;
            <span>{props.sqft} Sqft</span>
            {props.lotSizeArea && (
              <span>
                &nbsp;&nbsp;&middot;&nbsp;&nbsp;{props.lotSizeArea} Acres
              </span>
            )}
            &nbsp;&nbsp;&middot;&nbsp;&nbsp;
            <span>{props.builtYear}</span>
          </div>
        </div>
        {listing.new && (
          <div className="listing-card__alertStatus">{listing.new}</div>
        )}
        <Link
          className="listing-card__link"
          to={`/dashboard/mls/${listing.id}`}
        />
        {user && (
          <div className="listing-card__favorite-heart">
            <FavoriteHeart listing={listing} />
          </div>
        )}
      </div>
    </div>
  )
}

export default connect(({ user }) => ({ user }))(ListingCard)
