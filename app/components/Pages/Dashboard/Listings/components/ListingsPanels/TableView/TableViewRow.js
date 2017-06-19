import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { browserHistory } from 'react-router'
import withHandlers from 'recompose/withHandlers'

import FavoriteHeart from '../../FavoriteHeart'
import prepareListingViewItemProps from '../prepareListingViewItemProps'
import { setMapHoveredMarkerId } from '../../../../../../../store_actions/listings/map'

const TableViewRow = ({ user, listing, onMouseEnter, onMouseLeave }) => {
  const props = prepareListingViewItemProps(user, listing)

  return (
    <tr
      className="c-tableview__row"
      onClick={() => {
        browserHistory.push(`/listings/${listing.id}`)
      }}
      onMouseEnter={() => onMouseEnter(listing.id)}
      onMouseLeave={onMouseLeave}>
      <td className="c-tableview__address-cell">
        <div className="c-tableview__address-cell__img">
          {listing.cover_image_url && <img src={listing.cover_image_url} />}
        </div>
        <div className="c-tableview__address-cell__body">
          <h4 className="c-tableview__listing-address san-fran ellipses">
            {props.address}
          </h4>
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
      </td>
      <td>{props.area}</td>
      <td style={{ width: '12%' }}>{props.price}</td>
      <td>{props.beds}</td>
      <td>{props.baths}</td>
      <td>{props.sqft}</td>
      <td>{props.pricePerSquareFoot}</td>
      <td>{props.builtYear}</td>
    </tr>
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
)(TableViewRow)
