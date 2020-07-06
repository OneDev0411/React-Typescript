import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from 'reapop'

import { archiveEmailThreads } from 'models/email/archive-email-threads'

export default function useEmailThreadArchiver(emailThreadId: UUID) {
  const [archivingEmailThread, setArchivingEmailThread] = useState(false)
  const [emailThreadIsArchived, setEmailThreadIsArchived] = useState(false)

  useEffect(() => {
    setArchivingEmailThread(false)
    setEmailThreadIsArchived(false)
  }, [emailThreadId])

  const dispatch = useDispatch()

  async function archiveEmailThread(): Promise<boolean> {
    if (!emailThreadId || archivingEmailThread || emailThreadIsArchived) {
      return false
    }

    setArchivingEmailThread(true)

    try {
      await archiveEmailThreads([emailThreadId])
      setArchivingEmailThread(deletingEmailThread => {
        // Not to mark as archived if emailThreadId has been changed meanwhile.
        setEmailThreadIsArchived(deletingEmailThread)

        return false
      })

      return true
    } catch (reason) {
      console.error(reason)
      dispatch(
        addNotification({
          status: 'error',
          message: 'Something went wrong while archiving the email thread.'
        })
      )
      setArchivingEmailThread(false)

      return false
    }
  }

  return {
    archiveEmailThread,
    archivingEmailThread,
    emailThreadIsArchived,
    archiveEmailThreadDisabled: archivingEmailThread || emailThreadIsArchived
  }
}
