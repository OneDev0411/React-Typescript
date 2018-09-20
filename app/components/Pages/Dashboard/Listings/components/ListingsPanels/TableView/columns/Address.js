import React from 'react'
import { Link } from 'react-router'

import prepareListingViewItemProps from '../../prepareListingViewItemProps'

export const Address = ({ user, listing }) => {
  const props = prepareListingViewItemProps(user, listing)

  return (
    <React.Fragment>
      <div className="c-tableview__address-cell__img">
        {listing.cover_image_url && (
          <img alt="placeholder" src={listing.cover_image_url} />
        )}
      </div>
      <div className="c-tableview__address-cell__body">
        <Link
          to={`/dashboard/mls/${listing.id}`}
          className="c-tableview__listing-address ellipses"
        >
          {props.address}
        </Link>
        <p style={{ marginBottom: 0 }}>
          <i
            className="c-tableview__listing-status__icon"
            style={{ background: `#${props.statusColor}` }}
          />
          <small className="c-tableview__listing-status__text">
            {listing.status}
          </small>
        </p>
      </div>
    </React.Fragment>
  )
}
