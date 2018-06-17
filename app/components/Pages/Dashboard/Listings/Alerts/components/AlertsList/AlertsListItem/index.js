import React from 'react'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../../../../controllers/Brand'
import actions from '../../../../../../../../store_actions/listings/alerts'
import { alertStatuses } from '../../../../../../../../constants/listings/alerts'

import AlertListItemMenu from './components/AlertsListItemMenu'
import Follow from '../../../../../../../../views/components/Follow'

const SharedWith = ({ alert }) => {
  const { users, created_by } = alert
  const usersText = users
    .filter(user => user.id !== created_by.id)
    .map(user => user.first_name || user.phone_number)
    .join(', ')

  if (!usersText) {
    return null
  }

  return (
    <p className="c-alertList__item__shared-by san-fran">
      <span>Shared With: </span>
      {usersText}
    </p>
  )
}

const AlertListItem = ({
  user,
  alert,
  isSelected,
  onClickAlert,
  onClickDelete,
  onClickFollow
}) => (
  <IndexLink
    className={`c-alertList__item ${
      isSelected ? 'c-alertList__item--selected' : ''
    }`}
    to={`/dashboard/mls/alerts/${alert.id}`}
    onClick={() => onClickAlert(alert)}
  >
    <div className="c-alertList__item__info">
      <h3 className="c-alertList__item__title san-fran ellipses">
        {alert.title || alert.proposed_title || 'without title'}
      </h3>
      {user.id !== alert.created_by.id && (
        <p className="c-alertList__item__shared-by san-fran">
          <span>Shared By: </span>
          {alert.created_by.first_name}
        </p>
      )}
      {alert.users && alert.users.length > 0 && <SharedWith alert={alert} />}
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
    <Follow
      dropdownRightAlign="40px"
      statuses={alertStatuses}
      activeStatuses={
        alert.user_alert_setting && alert.user_alert_setting.status
      }
      isFetching={alert.isFetching}
      onClick={onClickFollow}
    />

    <AlertListItemMenu
      alertId={alert.id}
      onClickDelete={() => onClickDelete(alert)}
    />
  </IndexLink>
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
    },
    onClickFollow: ({
      changeAlertFollowStatuses = actions.changeAlertFollowStatuses,
      alert
    }) => statuses => {
      !alert.isFetching && changeAlertFollowStatuses(alert.id, statuses)
    }
  })
)(AlertListItem)
