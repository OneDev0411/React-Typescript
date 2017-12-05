import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import LazyLoad from 'react-lazy-load'
import listingUtils from '../../../../../../../utils/listing'

import FavoriteHeart from '../../FavoriteHeart'
import prepareProps from '../prepareListingViewItemProps'
import { setMapHoveredMarkerId } from '../../../../../../../store_actions/listings/map'

const ListingCard = ({
  user,
  listing,
  tabName,
  onClick,
  isWidget,
  children,
  activePanel,
  onMouseEnter,
  onMouseLeave
}) => {
  const props = prepareProps(user, listing)
  const mouseEventIsActive =
    tabName && tabName !== 'ALERTS' && activePanel && activePanel === 'map'

  const target = user && !isWidget ? '' : '_blank'

  const { lot_size_area } = listing.compact_property

  return (
    <LazyLoad className="c-listing-card" height={260} offsetBottom={900}>
      <div
        style={props.backgroundImage}
        className="c-listing-card__inner"
        onMouseLeave={mouseEventIsActive ? onMouseLeave : ''}
        onMouseEnter={mouseEventIsActive ? () => onMouseEnter(listing.id) : ''}
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
            {lot_size_area && (
              <span>&nbsp;&nbsp;&middot;&nbsp;&nbsp;{lot_size_area} Acres</span>
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
        {children}
      </div>
    </LazyLoad>
  )
}

export default compose(
  connect(({ user }) => ({ user }), { setMapHoveredMarkerId }),
  withHandlers({
    onMouseEnter: ({ setMapHoveredMarkerId, tabName }) => id => {
      setMapHoveredMarkerId(tabName, id)
    },
    onMouseLeave: ({ setMapHoveredMarkerId, tabName }) => () => {
      setMapHoveredMarkerId(tabName, -1)
    }
  })
)(ListingCard)
