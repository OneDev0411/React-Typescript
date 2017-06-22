import React from 'react'
import { connect } from 'react-redux'
import AlertsListRow from './AlertsListRow'

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

export default connect(({ alerts }, { alertsList }) => {
  const selectedAlert =
    alerts.selectedAlert || (alertsList.data.length && alertsList.data[0].id)

  return { selectedAlert }
})(AlertsList)
