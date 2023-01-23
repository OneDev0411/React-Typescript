import React from 'react'

import { Box, Button } from '@material-ui/core'
import { connect } from 'react-redux'

import PageLayout from 'components/GlobalPageLayout'

import { selectNotificationIsFetching } from '../../../../../reducers/notifications'
import {
  markAllNotificationsAsSeen,
  deleteNewNotifications
} from '../../../../../store_actions/notifications'
import useNotificationsBadgesContext from '../../SideNav/notificationsBadgesContext/useNotificationsBadgesContext'

const NotificationsHeader = props => {
  const { setBadge } = useNotificationsBadgesContext()

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
            setBadge('generic', 0)
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
