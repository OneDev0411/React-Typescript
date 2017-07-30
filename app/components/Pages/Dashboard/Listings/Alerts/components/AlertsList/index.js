import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import AlertsListItem from './AlertsListItem'
import withPropsOnChange from 'recompose/withPropsOnChange'

const AlertsList = ({
  user,
  alertsList,
  selectedAlertId,
  onClickDeleteAlert
}) =>
  <div className="c-alerts-list">
    {(alertsList.data.length &&
      alertsList.data.map((alert, index) =>
        <AlertsListItem
          key={`ALERT_LIST_ITEM_${index}`}
          user={user}
          alert={alert}
          onClickDelete={onClickDeleteAlert}
          isSelected={selectedAlertId === alert.id}
        />
      )) ||
      ''}
  </div>

export default compose(
  connect(({ data, alerts, chatroom }, { alertsList }) => ({
    user: data.user,
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

    return { alertsList: { data } }
  })
)(AlertsList)
