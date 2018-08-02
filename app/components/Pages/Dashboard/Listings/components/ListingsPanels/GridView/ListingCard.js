import React, { Fragment } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import LazyLoad from 'react-lazy-load'
import styled from 'styled-components'
import FavoriteHeart from '../../FavoriteHeart'
import Follow from '../../../../../../../views/components/Follow'
import prepareProps from '../prepareListingViewItemProps'
import { setMapHoveredMarkerId } from '../../../../../../../store_actions/listings/map'
import { listingStatuses } from '../../../../../../../constants/listings/listing'
import changeListingFollowStatuses from '../../../../../../../store_actions/listings/change-listing-follow-status'

const FollowContainer = styled.div`
  position: absolute;
  left: 1rem;
  top: 1rem;
`

const ListingCard = ({
  user,
  listing,
  tabName,
  onClick,
  isWidget,
  children,
  activePanel,
  onMouseEnter,
  onMouseLeave,
  onClickFollow
}) => {
  const props = prepareProps(user, listing)
  const mouseEventIsActive =
    tabName && tabName !== 'alerts' && activePanel && activePanel === 'map'

  const target = user && !isWidget ? '' : '_blank'

  return (
    <LazyLoad className="c-listing-card" height={260} offsetBottom={900}>
      <div
        style={props.backgroundImage}
        className="c-listing-card__inner"
        onMouseLeave={mouseEventIsActive ? onMouseLeave : () => {}}
        onMouseEnter={
          mouseEventIsActive ? () => onMouseEnter(listing.id) : () => {}
        }
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
          <Fragment>
            <div className="c-listing-card__favorite-heart">
              <FavoriteHeart listing={listing} />
            </div>
            <FollowContainer>
              <Follow
                statuses={listingStatuses}
                activeStatuses={
                  (listing.user_listing_notification_setting &&
                    listing.user_listing_notification_setting.status) ||
                  []
                }
                isFetching={listing.isFetching}
                onClick={onClickFollow}
              />
            </FollowContainer>
          </Fragment>
        )}

        {children}
      </div>
    </LazyLoad>
  )
}

export default compose(
  connect(
    ({ user }) => ({ user }),
    {
      setMapHoveredMarkerId,
      changeListingFollowStatuses
    }
  ),
  withHandlers({
    onMouseEnter: ({ setMapHoveredMarkerId, tabName }) => id => {
      setMapHoveredMarkerId(tabName, id)
    },
    onMouseLeave: ({ setMapHoveredMarkerId, tabName }) => () => {
      setMapHoveredMarkerId(tabName, -1)
    },
    onClickFollow: ({
      changeListingFollowStatuses,
      listing,
      tabName
    }) => statuses => {
      !listing.isFetching &&
        changeListingFollowStatuses(listing.id, statuses, tabName)
    }
  })
)(ListingCard)
