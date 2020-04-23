import React from 'react'
import { Link } from 'react-router'
import LazyLoad from 'react-lazy-load'

import { isLeaseProperty } from 'utils/listing'

import './style.scss'

import FavoriteHeart from '../FavoriteHeart'

const ListingCard = ({ isWidget = false, listing, onClick, user = null }) => {
  const target = user && !isWidget ? '' : '_blank'

  return (
    <LazyLoad className="c-listing-card" height={200} offsetBottom={900}>
      <div style={listing.backgroundImage} className="c-listing-card__inner">
        <div className="c-listing-card__content-wrapper">
          {listing.statusColor && (
            <div>
              <span
                className="c-listing-card__status"
                style={{ background: `#${listing.statusColor}` }}
              >
                {listing.status}
              </span>
            </div>
          )}
          <h4 className="c-listing-card__title">{listing.address}</h4>
          <div className="c-listing-card__price">
            $ {listing.price.toLocaleString()}
            {isLeaseProperty(listing) ? '/mo' : ''}
          </div>
          <div className="c-listing-card__details">
            <span>{listing.beds} Beds</span>
            &nbsp;&nbsp;&middot;&nbsp;&nbsp;
            <span>{listing.baths} Baths</span>
            &nbsp;&nbsp;&middot;&nbsp;&nbsp;
            <span>{listing.sqft.toLocaleString()} Sqft</span>
            {listing.lotSizeArea && (
              <span>
                &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                {listing.lotSizeArea.toLocaleString()} Acres
              </span>
            )}
            &nbsp;&nbsp;&middot;&nbsp;&nbsp;
            <span>{listing.builtYear}</span>
          </div>
        </div>
        {listing.new && (
          <div className="c-listing-card__alertStatus">{listing.new}</div>
        )}
        {typeof onClick === 'function' ? (
          <a
            href="#"
            role="button"
            target={target}
            onClick={onClick}
            className="c-listing-card__link"
          >
            {listing.address}
          </a>
        ) : (
          <Link
            target={target}
            to={`/dashboard/mls/${listing.id}`}
            className="c-listing-card__link"
          />
        )}
        {user && (
          <div className="c-listing-card__favorite-heart">
            <FavoriteHeart listing={listing} />
          </div>
        )}
      </div>
    </LazyLoad>
  )
}

export default ListingCard

// todo: add internal setMapHoveredMarkerId
