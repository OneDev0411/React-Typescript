import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import LazyLoad from 'react-lazy-load'

import FavoriteHeart from '../FavoriteHeart'
import { prepareListingsProperties } from '../../helpers/prepare-listings-properties'
import { setMapHoveredMarkerId } from '../../../../../../store_actions/listings/map'

const ListingCard = ({
  user,
  listing,
  onClick,
  isWidget,
  onMouseEnter,
  onMouseLeave,
  isShowOnMap = false
}) => {
  const props = prepareListingsProperties(user, listing)

  const target = user && !isWidget ? '' : '_blank'

  return (
    <LazyLoad className="c-listing-card" height={200} offsetBottom={900}>
      <div
        style={props.backgroundImage}
        className="c-listing-card__inner"
        onMouseLeave={isShowOnMap ? onMouseLeave : () => {}}
        onMouseEnter={isShowOnMap ? () => onMouseEnter(listing.id) : () => {}}
      >
        <div className="c-listing-card__content-wrapper">
          {props.statusColor && (
            <div>
              <span
                className="c-listing-card__status"
                style={{ background: `#${props.statusColor}` }}
              >
                {listing.status}
              </span>
            </div>
          )}
          <h4 className="c-listing-card__title">{props.address}</h4>
          <h5 className="c-listing-card__price">$ {props.price}</h5>
          <div className="c-listing-card__details">
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
          <div className="c-listing-card__alertStatus">{listing.new}</div>
        )}
        {typeof onClick === 'function' ? (
          <a
            href="#"
            target={target}
            onClick={onClick}
            className="c-listing-card__link"
          />
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

export default compose(
  connect(
    ({ user }) => ({ user }),
    {
      setMapHoveredMarkerId
    }
  ),
  withHandlers({
    onMouseEnter: ({ setMapHoveredMarkerId, tabName }) => id => {
      setMapHoveredMarkerId(tabName, id)
    },
    onMouseLeave: ({ setMapHoveredMarkerId, tabName }) => () => {
      setMapHoveredMarkerId(tabName, -1)
    }
  })
)(ListingCard)
