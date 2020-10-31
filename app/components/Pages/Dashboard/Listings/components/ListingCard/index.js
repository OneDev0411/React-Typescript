import React, { useState } from 'react'
import LazyLoad from 'react-lazy-load'
import { useSelector } from 'react-redux'
import { Checkbox, Dialog } from '@material-ui/core'
import { Link } from 'react-router'
import cn from 'classnames'

import { isLeaseProperty } from 'utils/listing'

import Listing from '../../Listing'

import './style.scss'

import FavoriteHeart from '../FavoriteHeart'

const ListingCard = ({
  listing,
  isWidget = false,
  selectable = true,
  selected = false,
  user = null,
  onClick,
  onToggleSelection = () => {}
}) => {
  const [isListingOpen, setIsListingOpen] = useState(false)
  const target = user && !isWidget ? '' : '_blank'

  const data = useSelector(({ data }) => data)

  const openListing = e => {
    e.preventDefault()
    window.history.pushState({}, '', `/dashboard/mls/${listing.id}`)
    setIsListingOpen(true)
  }

  const closeListing = () => {
    window.history.pushState({}, '', '/dashboard/mls')
    setIsListingOpen(false)
  }

  return (
    <>
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
              href={`/dashboard/mls/${listing.id}`}
              role="button"
              onClick={openListing}
              className="c-listing-card__link"
            >
              {listing.address}
            </Link>
          )}
          {user && (
            <div className="c-listing-card__favorite-heart">
              <FavoriteHeart listing={listing} />
            </div>
          )}

          {selectable && user && (
            <div
              className={cn('c-listing-card__selection', {
                visible: selected === true
              })}
            >
              <Checkbox
                size="small"
                checked={selected}
                onChange={() => onToggleSelection(listing)}
              />
            </div>
          )}
        </div>
      </LazyLoad>

      {isListingOpen && (
        <Dialog open fullScreen>
          <Listing
            style={{
              width: '100%',
              marginLeft: 0
            }}
            data={data}
            params={{
              id: listing.id
            }}
            onClose={closeListing}
          />
        </Dialog>
      )}
    </>
  )
}

export default ListingCard

// todo: add internal setMapHoveredMarkerId
