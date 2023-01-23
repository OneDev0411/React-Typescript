import { useState, useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { addNotification } from 'components/notification'
import { setEmailThreadsReadStatus } from 'models/email/set-email-threads-read-status'

import useNotificationsBadgesContext from '../../SideNav/notificationsBadgesContext/useNotificationsBadgesContext'

export default function useEmailThreadReadStatusSetter(
  emailThreadId: UUID,
  readStatus: boolean
) {
  const [settingEmailThreadReadStatus, setSettingEmailThreadReadStatus] =
    useState(false)
  const [lastEmailThreadReadStatus, setLastEmailThreadReadStatus] =
    useState(readStatus)

  useEffect(() => {
    setSettingEmailThreadReadStatus(false)
    setLastEmailThreadReadStatus(readStatus)
  }, [emailThreadId, readStatus])

  const dispatch = useDispatch()
  const { decreaseBadge, increaseBadge } = useNotificationsBadgesContext()

  async function setEmailThreadReadStatus(status: boolean): Promise<boolean> {
    if (
      !emailThreadId ||
      typeof readStatus !== 'boolean' ||
      settingEmailThreadReadStatus ||
      status === lastEmailThreadReadStatus
    ) {
      return false
    }

    setSettingEmailThreadReadStatus(true)

    try {
      await setEmailThreadsReadStatus([emailThreadId], status)
      setLastEmailThreadReadStatus(status)
      setSettingEmailThreadReadStatus(false)

      if (status) {
        decreaseBadge('unread_email_threads')
      } else {
        increaseBadge('unread_email_threads')
      }

      return true
    } catch (reason) {
      console.error(reason)
      dispatch(
        addNotification({
          status: 'error',
          message: `Something went wrong while marking the email thread as ${
            status ? 'read' : 'unread'
          }.`
        })
      )
      setSettingEmailThreadReadStatus(false)

      return false
    }
  }

  return {
    setEmailThreadReadStatus,
    settingEmailThreadReadStatus,
    lastEmailThreadReadStatus,
    setEmailThreadReadStatusDisabled:
      settingEmailThreadReadStatus || lastEmailThreadReadStatus !== readStatus
  }
}
