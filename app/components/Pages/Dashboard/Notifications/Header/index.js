import React from 'react'
import { connect } from 'react-redux'
import PageHeader from '../../../../../views/components/PageHeader'
import ActionButton from '../../../../../views/components/Button/ActionButton'
import { markAllNotificationsAsSeen } from '../../../../../store_actions/notifications'
import { selectNotificationIsFetching } from '../../../../../reducers/notifications'

const NotificationsHeader = ({ isFetching, markAllNotificationsAsSeen }) => (
  <PageHeader title="Notifications" showBackButton={false}>
    <PageHeader.Menu>
      <ActionButton
        disabled={isFetching}
        color="#2196f3"
        onClick={markAllNotificationsAsSeen}
      >
        Mark all as read
      </ActionButton>
    </PageHeader.Menu>
  </PageHeader>
)

export default connect(
  ({ globalNotifications }) => ({
    isFetching: selectNotificationIsFetching(globalNotifications)
  }),
  { markAllNotificationsAsSeen }
)(NotificationsHeader)
