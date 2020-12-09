import React from 'react'
import NotificationsSystem, { atalhoTheme, dismissNotification } from 'reapop'

import { useSelector, useDispatch } from 'react-redux'

import { IAppState } from 'reducers'

export function Notifications() {
  const notifications = useSelector<IAppState, IAppState['notifications']>(
    state => state.notifications
  )
  const dispatch = useDispatch()

  return (
    <NotificationsSystem
      notifications={notifications}
      dismissNotification={id => {
        dispatch(dismissNotification(id))
      }}
      theme={atalhoTheme}
    />
  )
}
