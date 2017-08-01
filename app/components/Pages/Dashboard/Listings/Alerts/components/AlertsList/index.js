import React from 'react'
import { connect } from 'react-redux'
import Waypoint from 'react-waypoint'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import AlertsListItem from './AlertsListItem'
import getAlerts from '../../../../../../../store_actions/listings/alerts/get-alerts'

const AlertsList = ({
  user,
  alertsList,
  isFetching,
  renderWaypoint,
  selectedAlertId,
  loadMoreHandler,
  onClickDeleteAlert
}) => {
  const alerts = alertsList.data
  const alertsLength = alerts.length

  return (
    <div className="c-alerts-list">
      {alerts.map((alert, index) =>
        <AlertsListItem
          key={`ALERT_LIST_ITEM_${index}`}
          user={user}
          alert={alert}
          onClickDelete={onClickDeleteAlert}
          isSelected={selectedAlertId === alert.id}
        />
      )}
      {!isFetching &&
        alertsList.info.total !== alertsLength &&
        <Waypoint onEnter={loadMoreHandler} />}
    </div>
  )
}

export default compose(
  connect(
    ({ data, alerts, chatroom }, { alertsList }) => ({
      user: data.user,
      rooms: chatroom.rooms,
      isFetching: alerts.isFetching,
      selectedAlertId: alerts.selectedAlertId
    }),
    { getAlerts }
  ),
  withHandlers({
    loadMoreHandler: ({ getAlerts, alertsList, isFetching }) => () => {
      const alerts = alertsList.data
      const alertslength = alerts.length

      if (isFetching || !alertslength) {
        return
      }

      const latestAlert = alerts[alertslength - 1]
      getAlerts(latestAlert.updated_at)
    }
  }),
  withPropsOnChange(['alertsList', 'rooms'], ({ alertsList, rooms, user }) => {
    if (!rooms) {
      return
    }

    const data = alertsList.data.map(
      alert =>
        !rooms[alert.room]
          ? alert
          : {
            ...alert,
            users: rooms[alert.room].users
          }
    )

    return { alertsList: { data, info: alertsList.info } }
  })
)(AlertsList)
