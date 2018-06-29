import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { browserHistory } from 'react-router'
import withHandlers from 'recompose/withHandlers'

import FavoriteHeart from '../../FavoriteHeart'
import prepareListingViewItemProps from '../prepareListingViewItemProps'
import { setMapHoveredMarkerId } from '../../../../../../../store_actions/listings/map'

const TableViewRow = ({
  user,
  tabName,
  listing,
  activePanel,
  onMouseEnter,
  onMouseLeave
}) => {
  const props = prepareListingViewItemProps(user, listing)
  const mouseEventIsActive =
    tabName !== 'alerts' && activePanel === 'table' && window.innerWidth >= 1920

  return (
    <tr
      className="c-tableview__row"
      onClick={() => {
        browserHistory.push(`/dashboard/mls/${listing.id}`)
      }}
      onMouseEnter={mouseEventIsActive ? () => onMouseEnter(listing.id) : () => {}}
      onMouseLeave={mouseEventIsActive ? onMouseLeave : () => {}}
    >
      <td className="c-tableview__address-cell">
        <div className="c-tableview__address-cell__img">
          {listing.cover_image_url && (
            <img alt="placeholder" src={listing.cover_image_url} />
          )}
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
      <td style={{ width: '15%' }}>{props.price}</td>
      <td style={{ width: '7%' }}>{props.beds}</td>
      <td style={{ width: '7%' }}>{props.baths}</td>
      <td style={{ width: '10%' }}>{props.sqft}</td>
      <td style={{ width: '10%' }}>{props.pricePerSquareFoot}</td>
      <td style={{ width: '10%' }}>{props.builtYear}</td>
      <td style={{ width: '10%' }}>{props.zipCode}</td>
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
