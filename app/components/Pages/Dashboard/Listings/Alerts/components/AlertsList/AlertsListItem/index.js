import React from 'react'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../../../../controllers/Brand'
import actions from '../../../../../../../../store_actions/listings/alerts'

import AlertListItemMenu from './components/AlertsListItemMenu'

const SharedWith = ({ alert }) => {
  const { users, created_by } = alert

  return (
    <p className="c-alertList__item__shared-by san-fran">
      <span>{'Shared With: '}</span>
      {users
        .filter(user => user.id !== created_by.id)
        .map((user, index) => user.first_name || user.phone_number)
        .join(', ')}
    </p>
  )
}

const AlertListItem = ({ user, alert, isSelected, onClickAlert, onClickDelete }) => (
  <div
    className={`c-alertList__item ${
      isSelected ? 'c-alertList__item--selected' : ''
    }`}
  >
    <IndexLink
      onClick={() => onClickAlert(alert)}
      className="c-alertList__item__link"
      to={`/dashboard/mls/alerts/${alert.id}`}
    />
    <div className="c-alertList__item__thumbnail">
      <img
        alt="mls alert list item - rechat"
        src={
          alert.cover_image_url
            ? alert.cover_image_url
            : '/static/images/deals/home.svg'
        }
      />
    </div>
    <div className="c-alertList__item__info">
      <h3 className="c-alertList__item__title san-fran ellipses">
        {alert.title || alert.proposed_title || 'without title'}
      </h3>
      {user.id !== alert.created_by.id && (
        <p className="c-alertList__item__shared-by san-fran">
          <span>{'Created By: '}</span>
          {alert.created_by.first_name}
        </p>
      )}
      {alert.user && alert.user.length > 0 && <SharedWith alert={alert} />}
    </div>
    {alert.new_recommendations &&
      parseInt(alert.new_recommendations, 10) > 0 && (
        <span
          className="c-alertList__item__badge"
          style={{ backgroundColor: `#${Brand.color('primary', '3388ff')}` }}
        >
          {alert.new_recommendations}
        </span>
      )}
    <AlertListItemMenu
      alertId={alert.id}
      onClickDelete={() => onClickDelete(alert)}
    />
  </div>
)

export default compose(
  connect(null, actions),
  withHandlers({
    onClickAlert: ({ getAlertFeed, clearAlertNotification }) => alert => {
      const { id, room, new_recommendations } = alert

      getAlertFeed(id, room)

      if (parseInt(new_recommendations, 10) > 0) {
        setTimeout(() => clearAlertNotification(id, room), 5000)
      }
    }
  })
)(AlertListItem)
