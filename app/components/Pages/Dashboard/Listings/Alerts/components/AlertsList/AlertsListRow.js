import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import Brand from '../../../../../../../controllers/Brand'
import getAlertFeed from '../../../../../../../store_actions/listings/alerts/get-alert-feed'
import clearAlertNotification from '../../../../../../../store_actions/listings/alerts/clear-alert-notification'

const SharedWith = ({ alert }) => {
  const { users, created_by } = alert
  return (
    <p className="c-alertList__item__shared-by san-fran">
      <span>
        {'Shared With: '}
      </span>
      {users
        .filter(user => user.id !== created_by.id)
        .map((user, index) => user.first_name)
        .join(', ')}
    </p>
  )
}

const AlertListRow = ({ user, alert, isSelected, onClick }) =>
  <div
    className={`c-alertList__item ${isSelected
      ? 'c-alertList__item--selected'
      : ''}`}
    onClick={() => onClick(alert)}
  >
    <div className="c-alertList__item__thumbnail">
      <img src={alert.cover_image_url} alt="mls alert list item - rechat" />
    </div>
    <div className="c-alertList__item__info">
      <h3 className="c-alertList__item__title san-fran ellipses">
        {alert.title || alert.proposed_title || 'without title'}
      </h3>
      {user.id !== alert.created_by.id &&
        <p className="c-alertList__item__shared-by san-fran">
          <span>
            {'Created By: '}
          </span>
          {alert.created_by.first_name}
        </p>}
      {alert.users && <SharedWith alert={alert} />}
    </div>
    {alert.new_recommendations &&
      parseInt(alert.new_recommendations, 10) > 0 &&
      <span
        className="c-alertList__item__badge"
        style={{ backgroundColor: `#${Brand.color('primary', '3388ff')}` }}
      >
        {alert.new_recommendations}
      </span>}
  </div>

export default compose(
  connect(null, { getAlertFeed, clearAlertNotification }),
  withHandlers({
    onClick: ({ getAlertFeed, clearAlertNotification }) => alert => {
      const { id, room, new_recommendations } = alert

      getAlertFeed(id, room)

      if (parseInt(new_recommendations, 10) > 0) {
        console.log('notif')
        clearAlertNotification(id, room)
      }
    }
  })
)(AlertListRow)
