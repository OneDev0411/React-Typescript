import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withPropsOnChange from 'recompose/withPropsOnChange'

import AlertsListItem from './AlertsListItem'

const AlertsList = ({ user, alertsList, selectedAlertId, onClickDeleteAlert }) => {
  const alerts = alertsList.data

  return (
    <div className="c-alerts-list">
      {alerts.map((alert, index) => (
        <AlertsListItem
          user={user}
          alert={alert}
          key={`ALERT_LIST_ITEM_${index}`}
          onClickDelete={onClickDeleteAlert}
          isSelected={selectedAlertId === alert.id}
        />
      ))}
    </div>
  )
}

export default compose(
  connect(({ user, alerts, chatroom }) => ({
    user,
    rooms: chatroom.rooms,
    selectedAlertId: alerts.selectedAlertId
  })),
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
