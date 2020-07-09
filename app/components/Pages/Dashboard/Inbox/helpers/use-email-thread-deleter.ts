import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from 'reapop'

import { deleteEmailThreads } from 'models/email/delete-email-threads'

export default function useEmailThreadDeleter(emailThreadId: UUID) {
  const [deletingEmailThread, setDeletingEmailThread] = useState(false)
  const [emailThreadIsDeleted, setEmailThreadIsDeleted] = useState(false)

  useEffect(() => {
    setDeletingEmailThread(false)
    setEmailThreadIsDeleted(false)
  }, [emailThreadId])

  const dispatch = useDispatch()

  async function deleteEmailThread(): Promise<boolean> {
    if (!emailThreadId || deletingEmailThread || emailThreadIsDeleted) {
      return false
    }

    setDeletingEmailThread(true)

    try {
      await deleteEmailThreads([emailThreadId])
      setDeletingEmailThread(deletingEmailThread => {
        // Not to mark as deleted if emailThreadId has been changed meanwhile.
        setEmailThreadIsDeleted(deletingEmailThread)

        return false
      })

      return true
    } catch (reason) {
      console.error(reason)
      dispatch(
        addNotification({
          status: 'error',
          message: 'Something went wrong while deleting the email thread.'
        })
      )
      setDeletingEmailThread(false)

      return false
    }
  }

  return {
    deleteEmailThread,
    deletingEmailThread,
    emailThreadIsDeleted,
    deleteEmailThreadDisabled: deletingEmailThread || emailThreadIsDeleted
  }
}
