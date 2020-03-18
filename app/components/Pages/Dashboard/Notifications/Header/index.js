import React from 'react'
import { connect } from 'react-redux'

import { Box, Button } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import {
  markAllNotificationsAsSeen,
  deleteNewNotifications
} from '../../../../../store_actions/notifications'
import { selectNotificationIsFetching } from '../../../../../reducers/notifications'

const NotificationsHeader = props => (
  <PageLayout.Header title="Notifications">
    <Box textAlign="right">
      <Button
        variant="outlined"
        size="large"
        disabled={props.isFetching}
        onClick={() => {
          props.dispatch(markAllNotificationsAsSeen())
          props.dispatch(deleteNewNotifications())
        }}
      >
        Mark all as read
      </Button>
    </Box>
  </PageLayout.Header>
)

export default connect(({ globalNotifications }) => ({
  isFetching: selectNotificationIsFetching(globalNotifications)
}))(NotificationsHeader)
