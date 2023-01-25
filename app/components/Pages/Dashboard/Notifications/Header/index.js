import React from 'react'

import { Box, Button } from '@material-ui/core'
import { connect } from 'react-redux'

import PageLayout from 'components/GlobalPageLayout'

import { selectNotificationIsFetching } from '../../../../../reducers/notifications'
import {
  markAllNotificationsAsSeen,
  deleteNewNotifications
} from '../../../../../store_actions/notifications'
import useNotificationBadgesContext from '../../SideNav/notificationBadgesContext/useNotificationBadgesContext'

const NotificationsHeader = props => {
  const { setBadgeCounter } = useNotificationBadgesContext()

  return (
    <PageLayout.Header title="Notifications">
      <Box textAlign="right">
        <Button
          variant="outlined"
          size="large"
          disabled={props.isFetching}
          onClick={() => {
            props.dispatch(markAllNotificationsAsSeen())
            props.dispatch(deleteNewNotifications())
            setBadgeCounter('generic', 0)
          }}
        >
          Mark all as read
        </Button>
      </Box>
    </PageLayout.Header>
  )
}

export default connect(({ globalNotifications }) => ({
  isFetching: selectNotificationIsFetching(globalNotifications)
}))(NotificationsHeader)
