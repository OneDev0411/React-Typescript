import React from 'react'
import { connect } from 'react-redux'

import PageHeader from '../../../../../views/components/PageHeader'
import ActionButton from '../../../../../views/components/Button/ActionButton'
import {
  markAllNotificationsAsSeen,
  deleteNewNotifications
} from '../../../../../store_actions/notifications'
import { selectNotificationIsFetching } from '../../../../../reducers/notifications'

const NotificationsHeader = props => (
  <PageHeader
    title="Notifications"
    showBackButton={false}
    style={{ height: '71px' }}
  >
    <PageHeader.Menu>
      <ActionButton
        disabled={props.isFetching}
        onClick={() => {
          props.dispatch(markAllNotificationsAsSeen())
          props.dispatch(deleteNewNotifications())
        }}
      >
        Mark all as read
      </ActionButton>
    </PageHeader.Menu>
  </PageHeader>
)

export default connect(({ globalNotifications }) => ({
  isFetching: selectNotificationIsFetching(globalNotifications)
}))(NotificationsHeader)
