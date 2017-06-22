import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import AlertsListRow from './AlertsListRow'
import withPropsOnChange from 'recompose/withPropsOnChange'

const AlertsList = ({ alertsList, selectedAlert }) =>
  <div className="c-alerts-list">
    {(alertsList.data.length &&
      alertsList.data.map((alert, index) =>
        <AlertsListRow
          key={`ALERT_LIST_ITEM_${index}`}
          alert={alert}
          isSelected={selectedAlert === alert.id}
        />
      )) ||
      ''}
  </div>

export default compose(
  connect(({ alerts, chatroom }, { alertsList }) => {
    const selectedAlert =
      alerts.selectedAlert || (alertsList.data.length && alertsList.data[0].id)

    return { selectedAlert, rooms: chatroom.rooms }
  }),
  withPropsOnChange(['alertsList', 'rooms'], ({ alertsList, rooms }) => {
    if (!rooms) {
      return
    }

    const data = alertsList.data.map(alert => ({
      ...alert,
      users: rooms[alert.room].users
    }))

    return { alertsList: { data } }
  })
)(AlertsList)
