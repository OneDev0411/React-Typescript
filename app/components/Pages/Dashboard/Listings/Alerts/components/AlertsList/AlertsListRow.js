import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import Brand from '../../../../../../../controllers/Brand'
import getAlertListings from '../../../../../../../store_actions/listings/alerts/get-alert-listings'
import clearAlertNotification from '../../../../../../../store_actions/listings/alerts/clear-alert-notif'

const SheredBy = ({ users }) =>
  <p className="c-alertList__item__shared-by san-fran">
    <span>{'Shared By: '}</span>
    {users.map((user, index) => user.first_name).join(', ')}
  </p>

const AlertListRow = ({ alert, isSelected, onClick }) =>
  <div
    className={`c-alertList__item ${isSelected
      ? 'c-alertList__item--selected'
      : ''}`}
    onClick={() => onClick(alert)}>
    <div className="c-alertList__item__thumbnail">
      <img src={alert.cover_image_url} alt="mls alert list item - rechat" />
    </div>
    <div className="c-alertList__item__info">
      <h3 className="c-alertList__item__title san-fran ellipses">
        {alert.title || alert.proposed_title || 'without title'}
      </h3>
      {alert.users && <SheredBy users={alert.users} />}
    </div>
    {alert.new_recommendations &&
      parseInt(alert.new_recommendations, 10) > 0 &&
      <span
        className="c-alertList__item__badge"
        style={{ backgroundColor: `#${Brand.color('primary', '3388ff')}` }}>
        {alert.new_recommendations}
      </span>}
  </div>

export default compose(
  connect(null, { getAlertListings, clearAlertNotification }),
  withHandlers({
    onClick: ({ getAlertListings, clearAlertNotification }) => alert => {
      getAlertListings(alert)
      if (parseInt(alert.new_recommendations, 10) > 0) {
        console.log('notif')
        clearAlertNotification(alert)
      }
    }
  })
)(AlertListRow)
