import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from 'reapop'

import { setEmailThreadsReadStatus } from 'models/email/set-email-threads-read-status'

export default function useEmailThreadReadStatusSetter(
  emailThreadId: UUID,
  readStatus: boolean
) {
  const [
    settingEmailThreadReadStatus,
    setSettingEmailThreadReadStatus
  ] = useState(false)
  const [lastEmailThreadReadStatus, setLastEmailThreadReadStatus] = useState(
    readStatus
  )

  const dispatch = useDispatch()

  async function setEmailThreadReadStatus(status: boolean): Promise<boolean> {
    if (settingEmailThreadReadStatus || status === lastEmailThreadReadStatus) {
      return false
    }

    setSettingEmailThreadReadStatus(true)

    try {
      await setEmailThreadsReadStatus([emailThreadId], status)
      setLastEmailThreadReadStatus(status)
      setSettingEmailThreadReadStatus(false)

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
    lastEmailThreadReadStatus
  }
}
